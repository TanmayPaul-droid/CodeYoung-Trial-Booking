/**
 * Generates a Google Calendar booking link for the scheduled trial session
 */
export function getGoogleCalendarUrl(booking) {
  const mentorName = booking.mentorId?.name || 'Mentor';
  const title = encodeURIComponent(`Codeyoung Live 1:1 Trial Class - ${booking.childName} (${booking.subject})`);
  const details = encodeURIComponent(
    `Codeyoung 1:1 Trial Class with ${mentorName}!\n\n` +
    `Subject: ${booking.subject}\n` +
    `Child: ${booking.childName} (Age ${booking.childAge})\n` +
    `Join Link: ${booking.meetingLink}\n\n` +
    `Your Local Time: ${booking.parentLocalStartTime}\n` +
    `Mentor Local Time: ${booking.mentorLocalStartTime}\n\n` +
    `Need to reschedule? Please reply to your confirmation email.`
  );
  const location = encodeURIComponent(booking.meetingLink || 'https://meet.codeyoung.com');
  
  // Format UTC dates to YYYYMMDDTHHmmssZ
  const startIso = new Date(booking.startTimeUTC).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endIso = new Date(booking.endTimeUTC).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const dates = `${startIso}/${endIso}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Generates and downloads an iCalendar (.ics) file for Outlook, Apple Calendar, etc.
 */
export function downloadIcsFile(booking) {
  const mentorName = booking.mentorId?.name || 'Mentor';
  const startIso = new Date(booking.startTimeUTC).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endIso = new Date(booking.endTimeUTC).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const nowIso = new Date().toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Codeyoung//Trial Class Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:codeyoung-${booking._id}@codeyoung.com`,
    `DTSTAMP:${nowIso}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:Codeyoung 1:1 Trial Class - ${booking.childName} (${booking.subject})`,
    `DESCRIPTION:Codeyoung 1:1 Trial Class with ${mentorName}\\nSubject: ${booking.subject}\\nLink: ${booking.meetingLink}\\nYour Time: ${booking.parentLocalStartTime}`,
    `URL:${booking.meetingLink}`,
    `LOCATION:${booking.meetingLink}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `codeyoung-trial-${booking.childName.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
