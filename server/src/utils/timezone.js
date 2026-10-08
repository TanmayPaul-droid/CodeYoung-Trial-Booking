import { fromZonedTime, formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { format as formatFns } from 'date-fns';

/**
 * Validates if the given string is a valid IANA timezone identifier.
 */
export function isValidIANATimezone(timezone) {
  if (!timezone || typeof timezone !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Converts a date string (YYYY-MM-DD) and time string (HH:mm) in a specific timezone to a UTC Date object.
 */
export function parseLocalToUTC(dateStr, timeStr, timezone) {
  if (!isValidIANATimezone(timezone)) {
    throw new Error(`Invalid IANA timezone: ${timezone}`);
  }
  const cleanTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  const isoString = `${dateStr}T${cleanTime}`;
  return fromZonedTime(isoString, timezone);
}

/**
 * Formats a UTC Date into a human-readable string in the specified timezone.
 * e.g., "Monday, Oct 12, 2026 at 02:00 PM (EDT)" or "2026-10-12 14:00 (EDT)"
 */
export function formatInTZ(date, timezone, formatPattern = 'yyyy-MM-dd HH:mm (zzz)') {
  if (!isValidIANATimezone(timezone)) {
    throw new Error(`Invalid IANA timezone: ${timezone}`);
  }
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, timezone, formatPattern);
}

/**
 * Gets the local date string (YYYY-MM-DD) of a UTC Date when viewed in a specific timezone.
 */
export function getLocalDateString(utcDate, timezone) {
  return formatInTimeZone(new Date(utcDate), timezone, 'yyyy-MM-dd');
}

/**
 * Gets the local time string (HH:mm) of a UTC Date when viewed in a specific timezone.
 */
export function getLocalTimeString(utcDate, timezone) {
  return formatInTimeZone(new Date(utcDate), timezone, 'HH:mm');
}

/**
 * Computes the UTC start and end bounds of a calendar day (00:00:00 to 23:59:59.999)
 * for a specific timezone.
 */
export function getDayBoundsUTC(dateStr, timezone) {
  const startOfDayUTC = fromZonedTime(`${dateStr}T00:00:00.000`, timezone);
  const endOfDayUTC = fromZonedTime(`${dateStr}T23:59:59.999`, timezone);
  return { startOfDayUTC, endOfDayUTC };
}

/**
 * Computes the mentor's operating window in UTC for a specific date (YYYY-MM-DD) in the mentor's local timezone.
 */
export function getMentorOperatingWindowUTC(mentor, dateInMentorTZ) {
  const startUTC = parseLocalToUTC(dateInMentorTZ, mentor.operatingHours.start, mentor.timezone);
  const endUTC = parseLocalToUTC(dateInMentorTZ, mentor.operatingHours.end, mentor.timezone);
  return { startUTC, endUTC };
}
