import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidIANATimezone,
  parseLocalToUTC,
  formatInTZ,
  getLocalDateString,
  getLocalTimeString,
  getDayBoundsUTC,
} from '../src/utils/timezone.js';

test('timezone utilities', async (t) => {
  await t.test('validates valid and invalid IANA timezones', () => {
    assert.strictEqual(isValidIANATimezone('America/New_York'), true);
    assert.strictEqual(isValidIANATimezone('Asia/Kolkata'), true);
    assert.strictEqual(isValidIANATimezone('Europe/London'), true);
    assert.strictEqual(isValidIANATimezone('UTC'), true);
    assert.strictEqual(isValidIANATimezone('Invalid/Zone'), false);
    assert.strictEqual(isValidIANATimezone(''), false);
    assert.strictEqual(isValidIANATimezone(null), false);
  });

  await t.test('converts local time to UTC correctly across timezones', () => {
    // 2026-10-12 10:00:00 in Asia/Kolkata (UTC+5:30) -> 2026-10-12 04:30:00 UTC
    const istUTC = parseLocalToUTC('2026-10-12', '10:00', 'Asia/Kolkata');
    assert.strictEqual(istUTC.toISOString(), '2026-10-12T04:30:00.000Z');

    // 2026-10-12 10:00:00 in America/New_York (EDT, UTC-4) -> 2026-10-12 14:00:00 UTC
    const nyUTC = parseLocalToUTC('2026-10-12', '10:00', 'America/New_York');
    assert.strictEqual(nyUTC.toISOString(), '2026-10-12T14:00:00.000Z');
  });

  await t.test('formats UTC date in parent and mentor local timezones correctly', () => {
    const utcDate = new Date('2026-10-12T14:00:00.000Z');
    
    // In NY: 10:00 EDT
    const nyFormatted = formatInTZ(utcDate, 'America/New_York', 'yyyy-MM-dd HH:mm');
    assert.strictEqual(nyFormatted, '2026-10-12 10:00');

    // In Kolkata: 19:30 IST
    const istFormatted = formatInTZ(utcDate, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm');
    assert.strictEqual(istFormatted, '2026-10-12 19:30');
  });

  await t.test('handles daylight saving transition accurately', () => {
    // Summer EDT (UTC-4)
    const summerUTC = parseLocalToUTC('2026-07-15', '12:00', 'America/New_York');
    assert.strictEqual(summerUTC.toISOString(), '2026-07-15T16:00:00.000Z');

    // Winter EST (UTC-5)
    const winterUTC = parseLocalToUTC('2026-12-15', '12:00', 'America/New_York');
    assert.strictEqual(winterUTC.toISOString(), '2026-12-15T17:00:00.000Z');
  });

  await t.test('gets correct local date and time strings', () => {
    const utcDate = new Date('2026-10-12T19:00:00.000Z');
    // In Asia/Tokyo (UTC+9), 19:00 UTC on 10-12 is 04:00 on 10-13!
    const tokyoDate = getLocalDateString(utcDate, 'Asia/Tokyo');
    const tokyoTime = getLocalTimeString(utcDate, 'Asia/Tokyo');
    assert.strictEqual(tokyoDate, '2026-10-13');
    assert.strictEqual(tokyoTime, '04:00');
  });
});
