import mongoose from 'mongoose';
import { Mentor } from '../models/Mentor.js';
import { Booking } from '../models/Booking.js';
import { checkMentorAvailabilityForSlot } from './slotService.js';
import {
  parseLocalToUTC,
  formatInTZ,
  isValidIANATimezone,
} from '../utils/timezone.js';

// Simple in-memory mutex to serialize concurrent booking attempts in node process
let bookingLock = Promise.resolve();
function acquireBookingLock() {
  let release;
  const nextLock = new Promise((resolve) => {
    release = resolve;
  });
  const currentLock = bookingLock;
  bookingLock = bookingLock.then(() => nextLock);
  return currentLock.then(() => release);
}

// Check once if MongoDB deployment supports multi-document transactions (requires replica set)
let canUseTransactions = null;
async function checkTransactionSupport() {
  if (canUseTransactions !== null) return canUseTransactions;
  try {
    const hello = await mongoose.connection.db.admin().command({ hello: 1 });
    canUseTransactions = Boolean(hello.setName);
  } catch (e) {
    canUseTransactions = false;
  }
  return canUseTransactions;
}

/**
 * Creates a trial class booking by matching an eligible mentor,
 * verifying constraints, and atomically persisting the booking.
 */
export async function createBooking(bookingPayload) {
  const {
    parentName,
    parentEmail,
    parentPhone,
    childName,
    childAge,
    subject,
    date, // 'YYYY-MM-DD'
    time, // 'HH:mm'
    startTimeUTC: inputStartTimeUTC,
    parentTimezone,
    notes,
  } = bookingPayload;

  // Validation
  if (!parentName?.trim()) throw new Error('Parent name is required.');
  if (!parentEmail?.trim()) throw new Error('Parent email is required.');
  if (!childName?.trim()) throw new Error('Child name is required.');
  if (!childAge || Number(childAge) < 4 || Number(childAge) > 18) {
    throw new Error('Child age must be between 4 and 18.');
  }
  if (!subject?.trim()) throw new Error('Subject is required.');
  if (!parentTimezone || !isValidIANATimezone(parentTimezone)) {
    throw new Error(`Valid IANA parent timezone is required (received: ${parentTimezone}).`);
  }

  // Determine start & end time UTC
  let startUTC;
  if (inputStartTimeUTC) {
    startUTC = new Date(inputStartTimeUTC);
    if (isNaN(startUTC.getTime())) {
      throw new Error('Invalid startTimeUTC format.');
    }
  } else if (date && time) {
    startUTC = parseLocalToUTC(date, time, parentTimezone);
  } else {
    throw new Error('Either startTimeUTC or (date, time) must be provided.');
  }

  // Duration is 30 minutes
  const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000);

  // Concurrency synchronization: acquire in-process lock
  const releaseLock = await acquireBookingLock();

  const isTxnSupported = await checkTransactionSupport();
  const session = isTxnSupported ? await mongoose.startSession() : null;

  try {
    if (session) {
      session.startTransaction();
    }

    const sessionOpts = session ? { session } : {};

    // 1. Fetch all active mentors
    const mentors = await Mentor.find({ isActive: true }, null, sessionOpts).sort({ _id: 1 });
    if (!mentors || mentors.length === 0) {
      throw new Error('No mentors registered in the system.');
    }

    // 2. Evaluate eligibility for each mentor
    const eligibleMentors = [];
    for (const mentor of mentors) {
      const check = await checkMentorAvailabilityForSlot(mentor, startUTC, endUTC, sessionOpts);
      if (check.isAvailable) {
        eligibleMentors.push({
          mentor,
          currentDailyCount: check.currentDailyCount,
        });
      }
    }

    // 3. If no eligible mentors, abort transaction and reject with 409
    if (eligibleMentors.length === 0) {
      const conflictError = new Error('No mentors available for the selected slot. All mentors are either outside operating hours, at full daily capacity, or already booked.');
      conflictError.statusCode = 409;
      throw conflictError;
    }

    // 4. Mentor assignment algorithm:
    // - Least loaded mentor first (fewest bookings today)
    // - Tie-breaker: mentor _id ascending
    eligibleMentors.sort((a, b) => {
      if (a.currentDailyCount !== b.currentDailyCount) {
        return a.currentDailyCount - b.currentDailyCount;
      }
      return a.mentor._id.toString().localeCompare(b.mentor._id.toString());
    });

    const selectedMentor = eligibleMentors[0].mentor;

    // 5. Generate meeting link and localized display times
    const meetingId = `${selectedMentor._id.toString().slice(-4)}-${Date.now().toString(36)}`;
    const meetingLink = `https://code-young-trial-booking.vercel.app/demo-class?meetingId=${meetingId}`;

    const parentLocalStartTime = formatInTZ(startUTC, parentTimezone, 'yyyy-MM-dd HH:mm (zzz)');
    const parentLocalEndTime = formatInTZ(endUTC, parentTimezone, 'yyyy-MM-dd HH:mm (zzz)');
    const mentorLocalStartTime = formatInTZ(startUTC, selectedMentor.timezone, 'yyyy-MM-dd HH:mm (zzz)');
    const mentorLocalEndTime = formatInTZ(endUTC, selectedMentor.timezone, 'yyyy-MM-dd HH:mm (zzz)');

    // 6. Create booking
    const booking = new Booking({
      mentorId: selectedMentor._id,
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      parentPhone: parentPhone ? parentPhone.trim() : '',
      childName: childName.trim(),
      childAge: Number(childAge),
      subject: subject.trim(),
      startTimeUTC: startUTC,
      endTimeUTC: endUTC,
      parentTimezone,
      parentLocalStartTime,
      parentLocalEndTime,
      mentorLocalStartTime,
      mentorLocalEndTime,
      status: 'confirmed',
      meetingLink,
      notes: notes || '',
    });

    if (session) {
      await booking.save({ session });
      await session.commitTransaction();
    } else {
      await booking.save();
    }

    // Return populated booking
    const populated = await Booking.findById(booking._id).populate('mentorId');
    return populated;
  } catch (error) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
    releaseLock();
  }
}

/**
 * Retrieves a booking by its ID with populated mentor details.
 */
export async function getBookingById(bookingId) {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const err = new Error('Invalid booking ID format');
    err.statusCode = 400;
    throw err;
  }
  const booking = await Booking.findById(bookingId).populate('mentorId');
  if (!booking) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }
  return booking;
}

/**
 * Lists all bookings (with optional filters)
 */
export async function listBookings(filter = {}) {
  return Booking.find(filter).populate('mentorId').sort({ startTimeUTC: -1 });
}
