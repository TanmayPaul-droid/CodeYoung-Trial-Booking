import { Mentor } from '../models/Mentor.js';
import { Booking } from '../models/Booking.js';
import {
  parseLocalToUTC,
  formatInTZ,
  getLocalDateString,
  getLocalTimeString,
  getDayBoundsUTC,
  isValidIANATimezone,
} from '../utils/timezone.js';

/**
 * Checks if a mentor is eligible and available for a given UTC slot [startTimeUTC, endTimeUTC].
 * 
 * @param {Object} mentor - Mentor Mongoose document or plain object
 * @param {Date} startTimeUTC - UTC start date
 * @param {Date} endTimeUTC - UTC end date
 * @param {Object} options - { session, preloadedBookings }
 * @returns {Promise<{ isAvailable: boolean, reason?: string, currentDailyCount: number }>}
 */
export async function checkMentorAvailabilityForSlot(mentor, startTimeUTC, endTimeUTC, options = {}) {
  const { session, preloadedBookings } = options;

  // 1. Check operating hours in mentor's local timezone
  const mentorStartDateStr = getLocalDateString(startTimeUTC, mentor.timezone);
  const mentorEndDateStr = getLocalDateString(endTimeUTC, mentor.timezone);

  // A 30-min slot must fall entirely within the mentor's operating window on the same calendar day
  if (mentorStartDateStr !== mentorEndDateStr) {
    return { isAvailable: false, reason: 'Crosses mentor midnight boundary', currentDailyCount: 0 };
  }

  const mentorStartTimeStr = getLocalTimeString(startTimeUTC, mentor.timezone);
  const mentorEndTimeStr = getLocalTimeString(endTimeUTC, mentor.timezone);

  if (
    mentorStartTimeStr < mentor.operatingHours.start ||
    mentorEndTimeStr > mentor.operatingHours.end
  ) {
    return {
      isAvailable: false,
      reason: `Outside mentor operating hours (${mentor.operatingHours.start}-${mentor.operatingHours.end} ${mentor.timezone})`,
      currentDailyCount: 0,
    };
  }

  // 2. Check daily class cap in mentor's local calendar day
  const { startOfDayUTC, endOfDayUTC } = getDayBoundsUTC(mentorStartDateStr, mentor.timezone);

  let dailyBookingsCount = 0;
  if (preloadedBookings) {
    dailyBookingsCount = preloadedBookings.filter(
      (b) =>
        b.mentorId.toString() === mentor._id.toString() &&
        b.status === 'confirmed' &&
        new Date(b.startTimeUTC) >= startOfDayUTC &&
        new Date(b.startTimeUTC) <= endOfDayUTC
    ).length;
  } else {
    dailyBookingsCount = await Booking.countDocuments(
      {
        mentorId: mentor._id,
        status: 'confirmed',
        startTimeUTC: { $gte: startOfDayUTC, $lte: endOfDayUTC },
      },
      null,
      session ? { session } : {}
    );
  }

  const maxClasses = mentor.maxDailyClasses || 2;
  if (dailyBookingsCount >= maxClasses) {
    return {
      isAvailable: false,
      reason: `Daily class limit reached (${dailyBookingsCount}/${maxClasses})`,
      currentDailyCount: dailyBookingsCount,
    };
  }

  // 3. Check overlap with existing confirmed bookings
  // Overlap condition: existing.startTimeUTC < requested.endTimeUTC AND existing.endTimeUTC > requested.startTimeUTC
  let hasOverlap = false;
  if (preloadedBookings) {
    hasOverlap = preloadedBookings.some(
      (b) =>
        b.mentorId.toString() === mentor._id.toString() &&
        b.status === 'confirmed' &&
        new Date(b.startTimeUTC) < endTimeUTC &&
        new Date(b.endTimeUTC) > startTimeUTC
    );
  } else {
    const overlapExists = await Booking.exists(
      {
        mentorId: mentor._id,
        status: 'confirmed',
        startTimeUTC: { $lt: endTimeUTC },
        endTimeUTC: { $gt: startTimeUTC },
      },
      session ? { session } : {}
    );
    hasOverlap = Boolean(overlapExists);
  }

  if (hasOverlap) {
    return {
      isAvailable: false,
      reason: 'Overlaps with existing confirmed booking',
      currentDailyCount: dailyBookingsCount,
    };
  }

  return { isAvailable: true, currentDailyCount: dailyBookingsCount };
}

/**
 * Generates all 30-minute slots for a parent's requested date and timezone,
 * checking global mentor availability for each slot.
 * 
 * @param {string} dateStr - 'YYYY-MM-DD' in parent's timezone
 * @param {string} parentTimezone - IANA timezone (e.g., 'America/New_York')
 * @returns {Promise<Array>} Array of slot objects
 */
export async function getAvailableSlotsForDate(dateStr, parentTimezone) {
  if (!isValidIANATimezone(parentTimezone)) {
    throw new Error(`Invalid IANA parent timezone: ${parentTimezone}`);
  }

  const mentors = await Mentor.find({ isActive: true }).sort({ _id: 1 });
  if (mentors.length === 0) {
    return [];
  }

  // Calculate parent day UTC range
  const { startOfDayUTC, endOfDayUTC } = getDayBoundsUTC(dateStr, parentTimezone);

  // Preload confirmed bookings in this window (with safety buffer of ±24 hours for mentor TZ shifts)
  const queryStart = new Date(startOfDayUTC.getTime() - 24 * 60 * 60 * 1000);
  const queryEnd = new Date(endOfDayUTC.getTime() + 24 * 60 * 60 * 1000);

  const bookings = await Booking.find({
    status: 'confirmed',
    startTimeUTC: { $gte: queryStart, $lte: queryEnd },
  }).lean();

  // Operating window for parents: 07:00 to 22:00 in 30-min intervals
  const slots = [];
  const startHour = 7;
  const endHour = 22; // up to 21:30 - 22:00 slot

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minute of [0, 30]) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const endMinute = minute === 0 ? 30 : 0;
      const endHourVal = minute === 0 ? hour : hour + 1;
      const endTimeStr = `${String(endHourVal).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      const startTimeUTC = parseLocalToUTC(dateStr, timeStr, parentTimezone);
      const endTimeUTC = parseLocalToUTC(dateStr, endTimeStr, parentTimezone);

      // Evaluate mentor availability for this slot
      const availableMentors = [];
      for (const mentor of mentors) {
        const check = await checkMentorAvailabilityForSlot(mentor, startTimeUTC, endTimeUTC, {
          preloadedBookings: bookings,
        });
        if (check.isAvailable) {
          availableMentors.push({
            mentorId: mentor._id,
            name: mentor.name,
            currentDailyCount: check.currentDailyCount,
          });
        }
      }

      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        startTimeUTC: startTimeUTC.toISOString(),
        endTimeUTC: endTimeUTC.toISOString(),
        isAvailable: availableMentors.length > 0,
        availableMentorsCount: availableMentors.length,
        mentors: availableMentors.map((m) => ({ id: m.mentorId, name: m.name })),
      });
    }
  }

  return slots;
}
