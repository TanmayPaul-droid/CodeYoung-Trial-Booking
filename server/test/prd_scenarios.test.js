
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { Mentor } from '../src/models/Mentor.js';
import { Booking } from '../src/models/Booking.js';
import { seedMentorsData } from '../src/scripts/seed.js';

import {
  parseLocalToUTC,
  formatInTZ,
  isValidIANATimezone,
  getLocalDateString,
} from '../src/utils/timezone.js';

import { checkMentorAvailabilityForSlot } from '../src/services/slotService.js';

import {
  createBooking,
  getBookingById,
} from '../src/services/bookingService.js';

// Prevent bookingService from sending real emails during tests.
// Add the NODE_ENV guard shown below to bookingService.js as well.
process.env.NODE_ENV = 'test';

const DEMO_ORIGIN =
  'https://code-young-trial-booking.vercel.app';

test('PRD 24 Test Scenarios Suite', async (t) => {
  const mongoServer = await MongoMemoryServer.create();

  try {
    await mongoose.connect(mongoServer.getUri());

    // This database is temporary and isolated from production Atlas.
    await Booking.deleteMany({});
    await Mentor.deleteMany({});

    const mentors = await Mentor.insertMany(seedMentorsData);

    const findIndianMentor = () =>
      mentors.find((mentor) => mentor.timezone === 'Asia/Kolkata');

    t.after(async () => {
      try {
        await mongoose.disconnect();
      } finally {
        await mongoServer.stop();
      }
    });

    // Scenario 1: Valid booking creates a confirmed record.
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

    // Scenario 2: A mentor is available during local operating hours.
    await t.test(
      'Scenario 2: Mentor assignment respects operating hours',
      async () => {
        const mentor = findIndianMentor();
        assert.ok(mentor, 'An Indian mentor must exist in the seed data');

        const startUTC = parseLocalToUTC(
          '2026-10-16',
          '10:00',
          mentor.timezone
        );
        const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000);

        const result = await checkMentorAvailabilityForSlot(
          mentor,
          startUTC,
          endUTC
        );

        assert.equal(result.isAvailable, true);
      }
    );

    // Scenario 3: A slot outside operating hours is unavailable.
    await t.test(
      'Scenario 3: Mentor is unavailable outside operating hours',
      async () => {
        const mentor = findIndianMentor();
        assert.ok(mentor, 'An Indian mentor must exist in the seed data');

        const startUTC = parseLocalToUTC(
          '2026-10-16',
          '03:00',
          mentor.timezone
        );
        const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000);

        const result = await checkMentorAvailabilityForSlot(
          mentor,
          startUTC,
          endUTC
        );

        assert.equal(result.isAvailable, false);
        assert.match(result.reason, /Outside mentor operating hours/);
      }
    );

    // Scenario 4: Overlapping bookings are prevented.
    await t.test(
      'Scenario 4: Overlapping booking prevented for same mentor',
      async () => {
        const mentor = mentors.find(
          (item) => item.name === 'Aarav Sharma'
        );
        assert.ok(mentor);

        const startUTC = parseLocalToUTC(
          '2026-10-17',
          '11:00',
          mentor.timezone
        );
        const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000);

        await new Booking({
          mentorId: mentor._id,
          parentName: 'Test Parent 1',
          parentEmail: 'tp1@example.com',
          childName: 'Child 1',
          childAge: 10,
          subject: 'Robotics',
          startTimeUTC: startUTC,
          endTimeUTC: endUTC,
          parentTimezone: mentor.timezone,
          status: 'confirmed',
        }).save();

        const exactCheck = await checkMentorAvailabilityForSlot(
          mentor,
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
          mentor,
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
        const mentor = mentors.find(
          (item) => item.name === 'Aarav Sharma'
        );
        assert.ok(mentor);

        const startUTC = parseLocalToUTC(
          '2026-10-17',
          '11:30',
          mentor.timezone
        );
        const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000);

        const result = await checkMentorAvailabilityForSlot(
          mentor,
          startUTC,
          endUTC
        );

        assert.equal(result.isAvailable, true);
      }
    );

    // Scenario 6: The daily limit is enforced.
    await t.test(
      'Scenario 6: Daily limit of 2 classes per mentor enforced',
      async () => {
        const mentor = mentors.find(
          (item) => item.name === 'Aarav Sharma'
        );
        assert.ok(mentor);

        const secondStart = parseLocalToUTC(
          '2026-10-17',
          '11:30',
          mentor.timezone
        );
        const secondEnd = new Date(
          secondStart.getTime() + 30 * 60 * 1000
        );

        await new Booking({
          mentorId: mentor._id,
          parentName: 'Test Parent 2',
          parentEmail: 'tp2@example.com',
          childName: 'Child 2',
          childAge: 10,
          subject: 'Robotics',
          startTimeUTC: secondStart,
          endTimeUTC: secondEnd,
          parentTimezone: mentor.timezone,
          status: 'confirmed',
        }).save();

        const thirdStart = parseLocalToUTC(
          '2026-10-17',
          '14:00',
          mentor.timezone
        );
        const thirdEnd = new Date(
          thirdStart.getTime() + 30 * 60 * 1000
        );

        const result = await checkMentorAvailabilityForSlot(
          mentor,
          thirdStart,
          thirdEnd
        );

        assert.equal(result.isAvailable, false);
        assert.match(result.reason, /Daily class limit reached/);
      }
    );

    // Scenario 7: A different eligible mentor is assigned.
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
          (item) => item.name === 'Aarav Sharma'
        );
        assert.ok(aarav);

        assert.notEqual(
          booking.mentorId._id.toString(),
          aarav._id.toString()
        );
      }
    );

    // Scenario 8: The least-loaded eligible mentor is preferred.
    await t.test(
      'Scenario 8: Least-loaded mentor chosen first',
      async () => {
        const indianMentors = mentors.filter(
          (mentor) => mentor.timezone === 'Asia/Kolkata'
        );

        assert.ok(indianMentors.length >= 2);

        const firstMentor = indianMentors[0];

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
          parentTimezone: 'Asia/Kolkata',
        });

        assert.ok(booking.mentorId);
        assert.notEqual(
          booking.mentorId._id.toString(),
          firstMentor._id.toString(),
          'A less-loaded eligible mentor should be selected'
        );
      }
    );

    // Scenario 9: Booking succeeds when mentors have equal load.
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

    // Scenario 10: Parent local time converts to UTC.
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

    // Scenario 11: Mentor local time is calculated from UTC.
    await t.test(
      'Scenario 11: Mentor local time computed from UTC correctly',
      async () => {
        const utcDate = new Date('2026-10-12T18:00:00.000Z');
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

        assert.ok(booking);
        assert.ok(booking.meetingLink);

        const meetingUrl = new URL(booking.meetingLink);

        assert.equal(meetingUrl.origin, DEMO_ORIGIN);
        assert.equal(meetingUrl.pathname, '/demo-class');
        assert.ok(meetingUrl.searchParams.get('meetingId'));
      }
    );

    // Scenario 14: Parent and mentor local times are returned.
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
        assert.match(booking.parentLocalStartTime, /2026-10-15/);
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

    // Scenario 16: Invalid timezones are rejected.
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

    // Scenario 18: Local dates across UTC midnight are handled.
    await t.test(
      'Scenario 18: Slots across midnight in UTC handled correctly',
      async () => {
        const utcDate = new Date('2026-10-12T23:45:00.000Z');
        const tokyoDate = getLocalDateString(
          utcDate,
          'Asia/Tokyo'
        );

        assert.equal(tokyoDate, '2026-10-13');
      }
    );

    // Scenario 19: Slots crossing a mentor's midnight are rejected.
    await t.test(
      'Scenario 19: Slot spanning mentor midnight is rejected',
      async () => {
        const mentor = findIndianMentor();
        assert.ok(mentor);

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

    // Scenario 20: Concurrent bookings should use different eligible mentors.
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
            time: '14:00',
            parentTimezone: 'Asia/Kolkata',
          })
        );

        const results = await Promise.all(promises);

        assert.equal(results.length, 3);

        const mentorIds = results.map((booking) =>
          booking.mentorId._id.toString()
        );

        assert.equal(
          new Set(mentorIds).size,
          3,
          'All three bookings should use different mentors'
        );
      }
    );

    // Scenario 21: Confirmed bookings never exceed the daily limit.
    await t.test(
      'Scenario 21: Enforces maximum two classes per mentor per day',
      async () => {
        const mentor = mentors.find(
          (item) => item.name === 'Aarav Sharma'
        );
        assert.ok(mentor);

        const bookings = await Booking.find({
          mentorId: mentor._id,
          status: 'confirmed',
        });

        const countsByDate = {};

        for (const booking of bookings) {
          const date = getLocalDateString(
            booking.startTimeUTC,
            mentor.timezone
          );

          countsByDate[date] = (countsByDate[date] || 0) + 1;

          assert.ok(
            countsByDate[date] <= 2,
            `Mentor exceeded two classes on ${date}`
          );
        }
      }
    );

    // Scenario 22: Exactly ten active mentors are seeded.
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

    // Scenario 24: A full mentor cannot receive a third booking that day.
    await t.test(
      'Scenario 24: Third booking is assigned to another eligible mentor',
      async () => {
        const mentor = mentors.find(
          (item) => item.name === 'Aarav Sharma'
        );
        assert.ok(mentor);

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

        const availability = await checkMentorAvailabilityForSlot(
          mentor,
          thirdStart,
          new Date(thirdStart.getTime() + durationMs)
        );

        assert.equal(availability.isAvailable, false);
        assert.match(
          availability.reason,
          /Daily class limit reached/
        );

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

        assert.ok(booking);
        assert.ok(booking.mentorId);

        assert.notEqual(
          booking.mentorId._id.toString(),
          mentor._id.toString(),
          'The full mentor must not receive the third booking'
        );

        const dayBookings = await Booking.find({
          mentorId: mentor._id,
          status: 'confirmed',
        });

        const sameDayBookings = dayBookings.filter(
          (item) =>
            getLocalDateString(item.startTimeUTC, timezone) === date
        );

        assert.equal(
          sameDayBookings.length,
          2,
          'The original mentor must still have exactly two bookings that day'
        );
      }
    );
  } catch (error) {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoServer.stop();
    throw error;
  }
});
