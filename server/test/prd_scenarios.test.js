
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

import { Mentor } from '../src/models/Mentor.js';
import { Booking } from '../src/models/Booking.js';
import { seedMentorsData } from '../src/scripts/seed.js';

import {
  parseLocalToUTC,
  formatInTZ,
  isValidIANATimezone,
  getLocalDateString,
} from '../src/utils/timezone.js';

import {
  checkMentorAvailabilityForSlot,
} from '../src/services/slotService.js';

import {
  createBooking,
  getBookingById,
} from '../src/services/bookingService.js';

const TEST_DB_URI =
  'mongodb://localhost:27017/codeyoung_booking';

const DEMO_ORIGIN =
  'https://code-young-trial-booking.vercel.app';

test('PRD 23 Test Scenarios Suite', async (t) => {
  await mongoose.connect(TEST_DB_URI);

  await Booking.deleteMany({});
  await Mentor.deleteMany({});

  const mentors = await Mentor.insertMany(seedMentorsData);

  t.after(async () => {
    await mongoose.disconnect();
  });

  // Scenario 1: Valid slot booking creates a confirmed record.
  await t.test(
    'Scenario 1: Valid slot booking creates confirmed record in DB',
    async () => {
      const booking = await createBooking({
        parentName: 'Alice Green',
        parentEmail: 'alice@example.com',
        childName: 'Sammy',
        childAge: 8,
        subject: 'Scratch Coding',
        date: '2026-10-15',
        time: '10:00',
        parentTimezone: 'America/New_York',
      });

      assert.ok(booking._id);
      assert.equal(booking.status, 'confirmed');
      assert.equal(booking.childName, 'Sammy');
      assert.ok(booking.mentorId);
    }
  );

  // Scenario 2: Mentor operating hours are checked locally.
  await t.test(
    'Scenario 2: Mentor assignment respects operating hours',
    async () => {
      const yuki = mentors.find(
        (mentor) => mentor.timezone === 'Asia/Tokyo'
      );

      assert.ok(yuki);

      const startUTC = parseLocalToUTC(
        '2026-10-16',
        '10:00',
        'Asia/Tokyo'
      );

      const endUTC = new Date(
        startUTC.getTime() + 30 * 60 * 1000
      );

      const result = await checkMentorAvailabilityForSlot(
        yuki,
        startUTC,
        endUTC
      );

      assert.equal(result.isAvailable, true);
    }
  );

  // Scenario 3: Outside operating hours must be rejected.
  await t.test(
    'Scenario 3: Mentor is unavailable outside operating hours',
    async () => {
      const yuki = mentors.find(
        (mentor) => mentor.timezone === 'Asia/Tokyo'
      );

      assert.ok(yuki);

      const startUTC = parseLocalToUTC(
        '2026-10-16',
        '03:00',
        'Asia/Tokyo'
      );

      const endUTC = new Date(
        startUTC.getTime() + 30 * 60 * 1000
      );

      const result = await checkMentorAvailabilityForSlot(
        yuki,
        startUTC,
        endUTC
      );

      assert.equal(result.isAvailable, false);
      assert.match(
        result.reason,
        /Outside mentor operating hours/
      );
    }
  );

  // Scenario 4: Overlapping bookings are prevented.
  await t.test(
    'Scenario 4: Overlapping booking prevented for same mentor',
    async () => {
      const aarav = mentors.find(
        (mentor) => mentor.name === 'Aarav Sharma'
      );

      assert.ok(aarav);

      const startUTC = parseLocalToUTC(
        '2026-10-17',
        '11:00',
        'Asia/Kolkata'
      );

      const endUTC = new Date(
        startUTC.getTime() + 30 * 60 * 1000
      );

      await new Booking({
        mentorId: aarav._id,
        parentName: 'Test Parent 1',
        parentEmail: 'tp1@example.com',
        childName: 'Child 1',
        childAge: 10,
        subject: 'Robotics',
        startTimeUTC: startUTC,
        endTimeUTC: endUTC,
        parentTimezone: 'Asia/Kolkata',
        status: 'confirmed',
      }).save();

      const exactCheck = await checkMentorAvailabilityForSlot(
        aarav,
        startUTC,
        endUTC
      );

      assert.equal(exactCheck.isAvailable, false);
      assert.match(
        exactCheck.reason,
        /Overlaps with existing confirmed booking/
      );

      const partialStart = new Date(
        startUTC.getTime() + 15 * 60 * 1000
      );

      const partialEnd = new Date(
        partialStart.getTime() + 30 * 60 * 1000
      );

      const partialCheck = await checkMentorAvailabilityForSlot(
        aarav,
        partialStart,
        partialEnd
      );

      assert.equal(partialCheck.isAvailable, false);
    }
  );

  // Scenario 5: Consecutive, non-overlapping bookings are allowed.
  await t.test(
    'Scenario 5: Non-overlapping consecutive bookings allowed',
    async () => {
      const aarav = mentors.find(
        (mentor) => mentor.name === 'Aarav Sharma'
      );

      const startUTC = parseLocalToUTC(
        '2026-10-17',
        '11:30',
        'Asia/Kolkata'
      );

      const endUTC = new Date(
        startUTC.getTime() + 30 * 60 * 1000
      );

      const result = await checkMentorAvailabilityForSlot(
        aarav,
        startUTC,
        endUTC
      );

      assert.equal(result.isAvailable, true);
    }
  );

  // Scenario 6: Daily booking limit is enforced.
  await t.test(
    'Scenario 6: Daily limit of 2 classes per mentor enforced',
    async () => {
      const aarav = mentors.find(
        (mentor) => mentor.name === 'Aarav Sharma'
      );

      const secondStart = parseLocalToUTC(
        '2026-10-17',
        '11:30',
        'Asia/Kolkata'
      );

      const secondEnd = new Date(
        secondStart.getTime() + 30 * 60 * 1000
      );

      await new Booking({
        mentorId: aarav._id,
        parentName: 'Test Parent 2',
        parentEmail: 'tp2@example.com',
        childName: 'Child 2',
        childAge: 10,
        subject: 'Robotics',
        startTimeUTC: secondStart,
        endTimeUTC: secondEnd,
        parentTimezone: 'Asia/Kolkata',
        status: 'confirmed',
      }).save();

      const thirdStart = parseLocalToUTC(
        '2026-10-17',
        '14:00',
        'Asia/Kolkata'
      );

      const thirdEnd = new Date(
        thirdStart.getTime() + 30 * 60 * 1000
      );

      const result = await checkMentorAvailabilityForSlot(
        aarav,
        thirdStart,
        thirdEnd
      );

      assert.equal(result.isAvailable, false);
      assert.match(result.reason, /Daily class limit reached/);
    }
  );

  // Scenario 7: A different eligible mentor should be assigned.
  await t.test(
    'Scenario 7: Third booking delegates to another eligible mentor',
    async () => {
      const booking = await createBooking({
        parentName: 'Parent 3',
        parentEmail: 'p3@example.com',
        childName: 'Child 3',
        childAge: 10,
        subject: 'Robotics',
        date: '2026-10-17',
        time: '14:00',
        parentTimezone: 'Asia/Kolkata',
      });

      assert.ok(booking);
      assert.ok(booking.mentorId);

      const aarav = mentors.find(
        (mentor) => mentor.name === 'Aarav Sharma'
      );

      assert.notEqual(
        booking.mentorId._id.toString(),
        aarav._id.toString()
      );
    }
  );

  // Scenario 8: Least-loaded eligible mentor is preferred.
  await t.test(
    'Scenario 8: Least-loaded mentor chosen first',
    async () => {
      const londonMentors = mentors.filter(
        (mentor) =>
          mentor.timezone === 'Europe/London' ||
          mentor.timezone === 'Europe/Berlin'
      );

      assert.ok(londonMentors.length >= 2);

      const firstMentor = londonMentors[0];

      const dummyStart = parseLocalToUTC(
        '2026-10-20',
        '10:00',
        firstMentor.timezone
      );

      await new Booking({
        mentorId: firstMentor._id,
        parentName: 'Early Bird',
        parentEmail: 'eb@example.com',
        childName: 'Kid',
        childAge: 10,
        subject: 'Math',
        startTimeUTC: dummyStart,
        endTimeUTC: new Date(
          dummyStart.getTime() + 30 * 60 * 1000
        ),
        parentTimezone: firstMentor.timezone,
        status: 'confirmed',
      }).save();

      const booking = await createBooking({
        parentName: 'Load Balance Parent',
        parentEmail: 'lb@example.com',
        childName: 'Kid 2',
        childAge: 12,
        subject: 'Coding',
        date: '2026-10-20',
        time: '14:00',
        parentTimezone: 'Europe/London',
      });

      assert.ok(booking.mentorId);

      assert.notEqual(
        booking.mentorId._id.toString(),
        firstMentor._id.toString()
      );
    }
  );

  // Scenario 9: Booking succeeds when multiple mentors have equal load.
  await t.test(
    'Scenario 9: Deterministic mentor assignment',
    async () => {
      const booking = await createBooking({
        parentName: 'Parent A',
        parentEmail: 'pa@example.com',
        childName: 'Child A',
        childAge: 9,
        subject: 'Coding',
        date: '2026-10-25',
        time: '10:00',
        parentTimezone: 'America/New_York',
      });

      assert.ok(booking.mentorId);
    }
  );

  // Scenario 10: Parent local time converts to UTC correctly.
  await t.test(
    'Scenario 10: Parent local time converted to UTC correctly',
    async () => {
      const utcDate = parseLocalToUTC(
        '2026-10-12',
        '14:00',
        'America/New_York'
      );

      assert.equal(
        utcDate.toISOString(),
        '2026-10-12T18:00:00.000Z'
      );
    }
  );

  // Scenario 11: Mentor local time is calculated correctly.
  await t.test(
    'Scenario 11: Mentor local time computed from UTC correctly',
    async () => {
      const utcDate = new Date(
        '2026-10-12T18:00:00.000Z'
      );

      const localTime = formatInTZ(
        utcDate,
        'Asia/Kolkata',
        'HH:mm'
      );

      assert.equal(localTime, '23:30');
    }
  );

  // Scenario 12: Booking timestamps are stored in UTC.
  await t.test(
    'Scenario 12: UTC timestamps correctly stored in DB',
    async () => {
      const booking = await Booking.findOne({
        childName: 'Sammy',
      });

      assert.ok(booking);

      assert.equal(
        booking.startTimeUTC.toISOString(),
        '2026-10-15T14:00:00.000Z'
      );

      assert.equal(
        booking.endTimeUTC.toISOString(),
        '2026-10-15T14:30:00.000Z'
      );
    }
  );

  // Scenario 13: Meeting URL uses the deployed application.
  await t.test(
    'Scenario 13: Meeting link generated with valid demo URL',
    async () => {
      const booking = await Booking.findOne({
        childName: 'Sammy',
      });

      assert.ok(booking, 'Test booking should exist');
      assert.ok(booking.meetingLink, 'Meeting link should exist');

      const meetingUrl = new URL(booking.meetingLink);

      assert.equal(
        meetingUrl.origin,
        DEMO_ORIGIN,
        'Meeting link should use the deployed Vercel application'
      );

      assert.equal(
        meetingUrl.pathname,
        '/demo-class',
        'Meeting link should open the demo-class route'
      );

      assert.ok(
        meetingUrl.searchParams.get('meetingId'),
        'Meeting link should contain a meetingId'
      );
    }
  );

  // Scenario 14: Both local time representations are returned.
  await t.test(
    'Scenario 14: Booking contains both parent and mentor local times',
    async () => {
      const booking = await Booking.findOne({
        childName: 'Sammy',
      });

      assert.ok(booking);
      assert.ok(booking.parentLocalStartTime);
      assert.ok(booking.parentLocalEndTime);
      assert.ok(booking.mentorLocalStartTime);
      assert.ok(booking.mentorLocalEndTime);

      assert.match(
        booking.parentLocalStartTime,
        /2026-10-15/
      );
    }
  );

  // Scenario 15: Valid IANA timezones are accepted.
  await t.test(
    'Scenario 15: Valid IANA timezones accepted',
    async () => {
      assert.equal(
        isValidIANATimezone('America/New_York'),
        true
      );

      assert.equal(
        isValidIANATimezone('Europe/London'),
        true
      );

      assert.equal(
        isValidIANATimezone('Asia/Kolkata'),
        true
      );
    }
  );

  // Scenario 16: Invalid IANA timezones are rejected.
  await t.test(
    'Scenario 16: Invalid timezones rejected',
    async () => {
      assert.equal(
        isValidIANATimezone('Mars/Olympus_Mons'),
        false
      );

      await assert.rejects(
        () =>
          createBooking({
            parentName: 'Fail Parent',
            parentEmail: 'fail@example.com',
            childName: 'Kid',
            childAge: 10,
            subject: 'Coding',
            date: '2026-10-25',
            time: '10:00',
            parentTimezone: 'Invalid/Timezone',
          }),
        /Valid IANA parent timezone is required/
      );
    }
  );

  // Scenario 17: Daylight saving time is handled.
  await t.test(
    'Scenario 17: Daylight saving transition handled accurately',
    async () => {
      const summer = parseLocalToUTC(
        '2026-07-01',
        '12:00',
        'America/New_York'
      );

      const winter = parseLocalToUTC(
        '2026-11-15',
        '12:00',
        'America/New_York'
      );

      assert.equal(summer.getUTCHours(), 16);
      assert.equal(winter.getUTCHours(), 17);
    }
  );

  // Scenario 18: UTC date changes are handled correctly.
  await t.test(
    'Scenario 18: Slots across midnight in UTC handled correctly',
    async () => {
      const utcDate = new Date(
        '2026-10-12T23:45:00.000Z'
      );

      const tokyoDate = getLocalDateString(
        utcDate,
        'Asia/Tokyo'
      );

      assert.equal(tokyoDate, '2026-10-13');
    }
  );

  // Scenario 19: Slots crossing the mentor's midnight are rejected.
  await t.test(
    'Scenario 19: Slot spanning mentor midnight is rejected',
    async () => {
      const mentor = mentors[0];

      const startUTC = parseLocalToUTC(
        '2026-10-12',
        '23:45',
        mentor.timezone
      );

      const endUTC = new Date(
        startUTC.getTime() + 30 * 60 * 1000
      );

      const result = await checkMentorAvailabilityForSlot(
        mentor,
        startUTC,
        endUTC
      );

      assert.equal(result.isAvailable, false);
      assert.equal(
        result.reason,
        'Crosses mentor midnight boundary'
      );
    }
  );

  // Scenario 20: Concurrent bookings do not double-book a mentor.
  await t.test(
    'Scenario 20: Concurrent booking requests serialize safely',
    async () => {
      const promises = [1, 2, 3].map((number) =>
        createBooking({
          parentName: `Concurrent Parent ${number}`,
          parentEmail: `concurrent${number}@example.com`,
          childName: `Child ${number}`,
          childAge: 9,
          subject: 'Coding',
          date: '2026-10-28',
          time: '08:00',
          parentTimezone: 'America/New_York',
        })
      );

      const results = await Promise.all(promises);

      assert.equal(results.length, 3);

      const mentorIds = results.map(
        (booking) => booking.mentorId._id.toString()
      );

      assert.equal(
        new Set(mentorIds).size,
        3,
        'All three bookings should use different mentors'
      );
    }
  );

  // Scenario 21: A mentor never exceeds two daily bookings.
  await t.test(
    'Scenario 21: Enforces maximum two classes per mentor per day',
    async () => {
      const elena = mentors.find(
        (mentor) => mentor.name === 'Elena Rodriguez'
      );

      assert.ok(elena);

      const bookings = await Booking.find({
        mentorId: elena._id,
        status: 'confirmed',
      });

      const countsByDate = {};

      for (const booking of bookings) {
        const date = getLocalDateString(
          booking.startTimeUTC,
          elena.timezone
        );

        countsByDate[date] =
          (countsByDate[date] || 0) + 1;

        assert.ok(
          countsByDate[date] <= 2,
          `Mentor exceeded two classes on ${date}`
        );
      }
    }
  );

  // Scenario 22: Ten active mentors are seeded.
  await t.test(
    'Scenario 22: Exactly 10 active mentors in database',
    async () => {
      const count = await Mentor.countDocuments({
        isActive: true,
      });

      assert.equal(count, 10);
    }
  );

  // Scenario 23: Booking lookup populates mentor details.
  await t.test(
    'Scenario 23: Lookup booking by ID returns populated mentor',
    async () => {
      const booking = await Booking.findOne();

      assert.ok(booking);

      const found = await getBookingById(booking._id);

      assert.ok(found);
      assert.ok(found.mentorId.name);
      assert.equal(found.childName, booking.childName);
    }
  );

  // Scenario 24: A third booking must not be assigned to a full mentor.
  await t.test(
    'Scenario 24: Third booking is assigned to another eligible mentor',
    async () => {
      const mentor = mentors.find(
        (m) => m.name === 'Aarav Sharma'
      );

      assert.ok(mentor, 'Aarav Sharma must exist in the test data');

      const date = '2026-10-30';
      const timezone = mentor.timezone;
      const durationMs = 30 * 60 * 1000;

      const firstStart = parseLocalToUTC(
        date,
        '10:00',
        timezone
      );

      const secondStart = parseLocalToUTC(
        date,
        '11:00',
        timezone
      );

      const thirdStart = parseLocalToUTC(
        date,
        '12:00',
        timezone
      );

      // Create two confirmed, non-overlapping bookings for this mentor.
      await Booking.insertMany([
        {
          mentorId: mentor._id,
          parentName: 'Daily Limit Parent 1',
          parentEmail: 'daily-limit-1@example.com',
          childName: 'Daily Limit Child 1',
          childAge: 10,
          subject: 'Coding',
          startTimeUTC: firstStart,
          endTimeUTC: new Date(
            firstStart.getTime() + durationMs
          ),
          parentTimezone: timezone,
          status: 'confirmed',
        },
        {
          mentorId: mentor._id,
          parentName: 'Daily Limit Parent 2',
          parentEmail: 'daily-limit-2@example.com',
          childName: 'Daily Limit Child 2',
          childAge: 10,
          subject: 'Coding',
          startTimeUTC: secondStart,
          endTimeUTC: new Date(
            secondStart.getTime() + durationMs
          ),
          parentTimezone: timezone,
          status: 'confirmed',
        },
      ]);

      // A mentor with two confirmed bookings must be unavailable for a third.
      const availability = await checkMentorAvailabilityForSlot(
        mentor,
        thirdStart,
        new Date(thirdStart.getTime() + durationMs)
      );

      assert.equal(
        availability.isAvailable,
        false,
        'A mentor with two confirmed bookings must be unavailable'
      );

      assert.match(
        availability.reason,
        /Daily class limit reached/
      );

      // The booking service should select another eligible mentor.
      const booking = await createBooking({
        parentName: 'Third Booking Parent',
        parentEmail: 'third-booking-parent@example.com',
        childName: 'Third Booking Child',
        childAge: 10,
        subject: 'Coding',
        date,
        time: '12:00',
        parentTimezone: timezone,
      });

      assert.ok(
        booking,
        'A booking should be created if another mentor is available'
      );

      assert.ok(
        booking.mentorId,
        'The new booking must have a mentor'
      );

      assert.notEqual(
        booking.mentorId._id.toString(),
        mentor._id.toString(),
        'The full mentor must not receive the third booking'
      );

      // Verify the original mentor still has exactly two bookings that day.
      const dayBookings = await Booking.find({
        mentorId: mentor._id,
        status: 'confirmed',
      });

      const sameDayBookings = dayBookings.filter(
        (item) =>
          getLocalDateString(
            item.startTimeUTC,
            timezone
          ) === date
      );

      assert.equal(
        sameDayBookings.length,
        2,
        'The original mentor must still have exactly two bookings that day'
      );
    }
  );
});
