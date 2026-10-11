
import mongoose from 'mongoose';
import { Mentor } from '../models/Mentor.js';
import { Booking } from '../models/Booking.js';
import { checkMentorAvailabilityForSlot } from './slotService.js';
import { sendBookingEmails } from './emailService.js';

import {
  parseLocalToUTC,
  formatInTZ,
  isValidIANATimezone,
} from '../utils/timezone.js';

// In-process mutex to serialize booking attempts.
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

// Check whether MongoDB supports multi-document transactions.
let canUseTransactions = null;

async function checkTransactionSupport() {
  if (canUseTransactions !== null) {
    return canUseTransactions;
  }

  try {
    const hello = await mongoose.connection.db.admin().command({
      hello: 1,
    });

    canUseTransactions = Boolean(hello.setName);
  } catch {
    canUseTransactions = false;
  }

  return canUseTransactions;
}

/**
 * Creates a trial booking and emails the parent and assigned mentor.
 */
export async function createBooking(bookingPayload) {
  const {
    parentName,
    parentEmail,
    parentPhone,
    childName,
    childAge,
    subject,
    date,
    time,
    startTimeUTC: inputStartTimeUTC,
    parentTimezone,
    notes,
  } = bookingPayload;

  // 1. Validate booking details.
  if (!parentName?.trim()) {
    const error = new Error('Parent name is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!parentEmail?.trim()) {
    const error = new Error('Parent email is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!childName?.trim()) {
    const error = new Error('Child name is required.');
    error.statusCode = 400;
    throw error;
  }

  if (
    childAge === undefined ||
    childAge === null ||
    childAge === '' ||
    !Number.isFinite(Number(childAge)) ||
    Number(childAge) < 4 ||
    Number(childAge) > 18
  ) {
    const error = new Error(
      'Child age must be between 4 and 18.'
    );
    error.statusCode = 400;
    throw error;
  }

  if (!subject?.trim()) {
    const error = new Error('Subject is required.');
    error.statusCode = 400;
    throw error;
  }

  if (
    !parentTimezone ||
    !isValidIANATimezone(parentTimezone)
  ) {
    const error = new Error(
      `Valid IANA parent timezone is required (received: ${parentTimezone}).`
    );
    error.statusCode = 400;
    throw error;
  }

  // 2. Convert the requested start time to UTC.
  let startUTC;

  try {
    if (inputStartTimeUTC) {
      startUTC = new Date(inputStartTimeUTC);

      if (Number.isNaN(startUTC.getTime())) {
        throw new Error('Invalid startTimeUTC format.');
      }
    } else if (date && time) {
      startUTC = parseLocalToUTC(
        date,
        time,
        parentTimezone
      );
    } else {
      throw new Error(
        'Either startTimeUTC or (date, time) must be provided.'
      );
    }
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    throw error;
  }

  // Each trial class lasts 30 minutes.
  const endUTC = new Date(
    startUTC.getTime() + 30 * 60 * 1000
  );

  // 3. Serialize booking attempts within this Node.js process.
  const releaseLock = await acquireBookingLock();

  let session = null;
  let populatedBooking = null;

  try {
    const isTxnSupported = await checkTransactionSupport();

    if (isTxnSupported) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    const sessionOpts = session ? { session } : {};

    // 4. Fetch active mentors.
    const mentors = await Mentor.find(
      { isActive: true },
      null,
      sessionOpts
    ).sort({ _id: 1 });

    if (mentors.length === 0) {
      const error = new Error(
        'We are unable to find any active mentors right now. Please try again later.'
      );
      error.statusCode = 503;
      throw error;
    }

    // 5. Check availability for every active mentor.
    const eligibleMentors = [];

    for (const mentor of mentors) {
      const availability = await checkMentorAvailabilityForSlot(
        mentor,
        startUTC,
        endUTC,
        sessionOpts
      );

      if (availability.isAvailable) {
        eligibleMentors.push({
          mentor,
          currentDailyCount:
            availability.currentDailyCount ?? 0,
        });
      }
    }

    // 6. Return a conflict if no mentor is available.
    if (eligibleMentors.length === 0) {
      const error = new Error(
        'Sorry, no mentors are available for your selected date and time. Please choose another date or time slot and try again.'
      );
      error.statusCode = 409;
      throw error;
    }

    // 7. Prefer the least-loaded eligible mentor.
    eligibleMentors.sort((a, b) => {
      if (a.currentDailyCount !== b.currentDailyCount) {
        return a.currentDailyCount - b.currentDailyCount;
      }

      return a.mentor._id
        .toString()
        .localeCompare(b.mentor._id.toString());
    });

    const selectedMentor = eligibleMentors[0].mentor;

    // 8. Generate the existing demo-class link.
    const meetingId =
      `${selectedMentor._id.toString().slice(-4)}-` +
      `${Date.now().toString(36)}`;

    const meetingLink =
      `https://code-young-trial-booking.vercel.app/demo-class` +
      `?meetingId=${encodeURIComponent(meetingId)}`;

    const parentLocalStartTime = formatInTZ(
      startUTC,
      parentTimezone,
      'yyyy-MM-dd HH:mm (zzz)'
    );

    const parentLocalEndTime = formatInTZ(
      endUTC,
      parentTimezone,
      'yyyy-MM-dd HH:mm (zzz)'
    );

    const mentorLocalStartTime = formatInTZ(
      startUTC,
      selectedMentor.timezone,
      'yyyy-MM-dd HH:mm (zzz)'
    );

    const mentorLocalEndTime = formatInTZ(
      endUTC,
      selectedMentor.timezone,
      'yyyy-MM-dd HH:mm (zzz)'
    );

    // 9. Create the confirmed booking.
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

    // 10. Populate the saved booking with mentor details.
    populatedBooking = await Booking.findById(
      booking._id
    ).populate('mentorId');

  } catch (error) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    if (session) {
      await session.endSession();
    }

    releaseLock();
  }

  // 11. Send emails after the booking is saved and the lock is released.
  // Automated tests must never send real emails.
  if (process.env.NODE_ENV !== 'test') {
    try {
      const emailResult = await sendBookingEmails({
        booking: populatedBooking,
        mentor: populatedBooking.mentorId,
      });

      console.log('[Booking] Email notification results:', {
        bookingId: populatedBooking._id.toString(),
        ...emailResult,
      });
    } catch (emailError) {
      // Email failure must not invalidate a confirmed booking.
      console.error(
        '[Booking] Email notification failed:',
        emailError.message
      );
    }
  }

  // 12. Preserve the existing API return value.
  return populatedBooking;
}

/**
 * Retrieves a booking by its ID with populated mentor details.
 */
export async function getBookingById(bookingId) {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error('Invalid booking ID format.');
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId)
    .populate('mentorId');

  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  return booking;
}

/**
 * Lists bookings with optional MongoDB filters.
 */
export async function listBookings(filter = {}) {
  return Booking.find(filter)
    .populate('mentorId')
    .sort({ startTimeUTC: -1 });
}
