
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  isValidIANATimezone,
  parseLocalToUTC,
  formatInTZ,
  getLocalDateString,
  getLocalTimeString,
} from '../src/utils/timezone.js';

test('timezone utilities', async (t) => {
  await t.test('validates IANA timezone identifiers', () => {
    assert.equal(isValidIANATimezone('America/New_York'), true);
    assert.equal(isValidIANATimezone('Asia/Kolkata'), true);
    assert.equal(isValidIANATimezone('Asia/Singapore'), true);
    assert.equal(isValidIANATimezone('Invalid/Timezone'), false);
  });

  await t.test(
    'converts local time to UTC correctly across timezones',
    () => {
      const nyUTC = parseLocalToUTC(
        '2026-10-12',
        '10:00',
        'America/New_York'
      );

      assert.equal(
        nyUTC.toISOString(),
        '2026-10-12T14:00:00.000Z'
      );
    }
  );

  await t.test(
    'formats UTC date in parent and mentor local timezones correctly',
    () => {
      const utcDate = new Date('2026-10-12T14:00:00.000Z');

      const nyFormatted = formatInTZ(
        utcDate,
        'America/New_York',
        'yyyy-MM-dd HH:mm'
      );

      assert.equal(nyFormatted, '2026-10-12 10:00');

      const istFormatted = formatInTZ(
        utcDate,
        'Asia/Kolkata',
        'yyyy-MM-dd HH:mm'
      );

      assert.equal(istFormatted, '2026-10-12 19:30');
    }
  );

  await t.test(
    'handles daylight saving transition accurately',
    () => {
      // Summer in New York: EDT (UTC-4)
      const summerUTC = parseLocalToUTC(
        '2026-07-15',
        '12:00',
        'America/New_York'
      );

      assert.equal(
        summerUTC.toISOString(),
        '2026-07-15T16:00:00.000Z'
      );

      // Winter in New York: EST (UTC-5)
      const winterUTC = parseLocalToUTC(
        '2026-12-15',
        '12:00',
        'America/New_York'
      );

      assert.equal(
        winterUTC.toISOString(),
        '2026-12-15T17:00:00.000Z'
      );
    }
  );

  await t.test(
    'converts New York time to Kolkata time after DST ends',
    () => {
      const utcTime = parseLocalToUTC(
        '2026-11-02',
        '12:30',
        'America/New_York'
      );

      assert.equal(
        formatInTZ(
          utcTime,
          'Asia/Kolkata',
          'yyyy-MM-dd HH:mm'
        ),
        '2026-11-02 23:00'
      );
    }
  );

  await t.test(
    'gets correct local date and time strings',
    () => {
      const utcDate = new Date('2026-10-12T19:00:00.000Z');

      assert.equal(
        getLocalDateString(utcDate, 'Asia/Tokyo'),
        '2026-10-13'
      );

      assert.equal(
        getLocalTimeString(utcDate, 'Asia/Tokyo'),
        '04:00'
      );
    }
  );
});
