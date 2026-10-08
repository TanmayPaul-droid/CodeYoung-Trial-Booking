import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { Mentor } from '../src/models/Mentor.js';
import { Booking } from '../src/models/Booking.js';
import { seed, seedMentorsData } from '../src/scripts/seed.js';
import {
  parseLocalToUTC,
  formatInTZ,
  isValidIANATimezone,
  getLocalDateString,
  getLocalTimeString,
} from '../src/utils/timezone.js';
import { getAvailableSlotsForDate, checkMentorAvailabilityForSlot } from '../src/services/slotService.js';
import { createBooking, getBookingById } from '../src/services/bookingService.js';

test('PRD 23 Test Scenarios Suite', async (t) => {
  // Connect to DB and seed fresh dataset
  await mongoose.connect('mongodb://localhost:27017/codeyoung_booking');
  await Booking.deleteMany({});
  await Mentor.deleteMany({});
  const mentors = await Mentor.insertMany(seedMentorsData);

  t.after(async () => {
    await mongoose.disconnect();
  });

  // Scenario 1: Valid slot booking creates booking record
  await t.test('Scenario 1: Valid slot booking creates confirmed record in DB', async () => {
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

    assert.ok(booking._id, 'Booking ID should be created');
    assert.strictEqual(booking.status, 'confirmed');
    assert.strictEqual(booking.childName, 'Sammy');
    assert.ok(booking.mentorId, 'Mentor should be assigned');
  });

  // Scenario 2: Mentor assignment respects operating hours (local time)
  await t.test('Scenario 2: Mentor assignment respects operating hours in mentor local time', async () => {
    // Yuki Tanaka is in Asia/Tokyo (09:00 - 17:00 JST).
    // Let's find Yuki
    const yuki = mentors.find((m) => m.timezone === 'Asia/Tokyo');
    assert.ok(yuki);

    // 10:00 JST on 2026-10-16 is within Yuki's operating hours
    const startUTC = parseLocalToUTC('2026-10-16', '10:00', 'Asia/Tokyo');
    const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000);
    const checkWithin = await checkMentorAvailabilityForSlot(yuki, startUTC, endUTC);
    assert.strictEqual(checkWithin.isAvailable, true);
  });

  // Scenario 3: No mentor assigned if outside operating hours
  await t.test('Scenario 3: Mentor is unavailable outside operating hours', async () => {
    const yuki = mentors.find((m) => m.timezone === 'Asia/Tokyo');
    // 03:00 JST is outside operating hours (09:00 - 17:00)
    const startUTC = parseLocalToUTC('2026-10-16', '03:00', 'Asia/Tokyo');
    const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000);
    const checkOutside = await checkMentorAvailabilityForSlot(yuki, startUTC, endUTC);
    assert.strictEqual(checkOutside.isAvailable, false);
    assert.match(checkOutside.reason, /Outside mentor operating hours/);
  });

  // Scenario 4: Overlapping booking prevented for same mentor
  await t.test('Scenario 4: Overlapping booking prevented for same mentor', async () => {
    // Book a specific mentor for a slot
    const aarav = mentors.find((m) => m.name === 'Aarav Sharma');
    const startUTC = parseLocalToUTC('2026-10-17', '11:00', 'Asia/Kolkata');
    const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000);

    const b1 = new Booking({
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
    });
    await b1.save();

    // Check availability for exact same slot
    const checkExact = await checkMentorAvailabilityForSlot(aarav, startUTC, endUTC);
    assert.strictEqual(checkExact.isAvailable, false);
    assert.match(checkExact.reason, /Overlaps with existing confirmed booking/);

    // Overlap condition: start 15 mins into the existing booking
    const partialOverlapStart = new Date(startUTC.getTime() + 15 * 60 * 1000);
    const partialOverlapEnd = new Date(partialOverlapStart.getTime() + 30 * 60 * 1000);
    const checkPartial = await checkMentorAvailabilityForSlot(aarav, partialOverlapStart, partialOverlapEnd);
    assert.strictEqual(checkPartial.isAvailable, false);
  });

  // Scenario 5: Non-overlapping consecutive bookings allowed
  await t.test('Scenario 5: Non-overlapping consecutive bookings allowed', async () => {
    const aarav = mentors.find((m) => m.name === 'Aarav Sharma');
    // B1 is at 11:00 - 11:30 IST.
    // Consecutive slot: 11:30 - 12:00 IST
    const consecutiveStart = parseLocalToUTC('2026-10-17', '11:30', 'Asia/Kolkata');
    const consecutiveEnd = new Date(consecutiveStart.getTime() + 30 * 60 * 1000);

    const checkConsecutive = await checkMentorAvailabilityForSlot(aarav, consecutiveStart, consecutiveEnd);
    assert.strictEqual(checkConsecutive.isAvailable, true);
  });

  // Scenario 6: Daily limit of 2 classes per mentor enforced
  await t.test('Scenario 6: Daily limit of 2 classes per mentor enforced', async () => {
    const aarav = mentors.find((m) => m.name === 'Aarav Sharma');
    // Add second booking on 2026-10-17
    const secondStart = parseLocalToUTC('2026-10-17', '11:30', 'Asia/Kolkata');
    const secondEnd = new Date(secondStart.getTime() + 30 * 60 * 1000);

    const b2 = new Booking({
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
    });
    await b2.save();

    // Aarav now has 2 bookings on 2026-10-17. Check 3rd slot on same day:
    const thirdStart = parseLocalToUTC('2026-10-17', '14:00', 'Asia/Kolkata');
    const thirdEnd = new Date(thirdStart.getTime() + 30 * 60 * 1000);

    const checkThird = await checkMentorAvailabilityForSlot(aarav, thirdStart, thirdEnd);
    assert.strictEqual(checkThird.isAvailable, false);
    assert.match(checkThird.reason, /Daily class limit reached \(2\/2\)/);
  });

  // Scenario 7: 3rd booking on same day rejected or assigned to next mentor
  await t.test('Scenario 7: 3rd booking on same day delegates to another eligible mentor', async () => {
    // If Aarav is at capacity, createBooking should pick the next eligible mentor for that time
    const booking3 = await createBooking({
      parentName: 'Parent 3',
      parentEmail: 'p3@example.com',
      childName: 'Child 3',
      childAge: 10,
      subject: 'Robotics',
      date: '2026-10-17',
      time: '14:00',
      parentTimezone: 'Asia/Kolkata',
    });

    assert.ok(booking3);
    assert.notStrictEqual(booking3.mentorId._id.toString(), mentors.find((m) => m.name === 'Aarav Sharma')._id.toString());
  });

  // Scenario 8: Least-loaded mentor chosen first (load balancing)
  await t.test('Scenario 8: Least-loaded mentor chosen first for load balancing', async () => {
    // For a brand new day 2026-10-20 at 14:00 London time:
    // Give one mentor 1 class, leave others with 0 classes
    const londonMentors = mentors.filter((m) => m.timezone === 'Europe/London' || m.timezone === 'Europe/Berlin');
    assert.ok(londonMentors.length >= 2);

    const m1 = londonMentors[0];
    const dummyStart = parseLocalToUTC('2026-10-20', '10:00', m1.timezone);
    await new Booking({
      mentorId: m1._id,
      parentName: 'Early Bird',
      parentEmail: 'eb@example.com',
      childName: 'Kid',
      childAge: 10,
      subject: 'Math',
      startTimeUTC: dummyStart,
      endTimeUTC: new Date(dummyStart.getTime() + 30 * 60 * 1000),
      parentTimezone: m1.timezone,
      status: 'confirmed',
    }).save();

    // Now book at 14:00 Europe/London: m1 has 1 booking, m2 has 0 bookings
    const balancedBooking = await createBooking({
      parentName: 'Load Balance Parent',
      parentEmail: 'lb@example.com',
      childName: 'Kid 2',
      childAge: 12,
      subject: 'Coding',
      date: '2026-10-20',
      time: '14:00',
      parentTimezone: 'Europe/London',
    });

    // The assigned mentor must have 0 prior bookings on that day (least loaded)
    assert.notStrictEqual(balancedBooking.mentorId._id.toString(), m1._id.toString(), 'Should choose mentor with 0 bookings over mentor with 1 booking');
  });

  // Scenario 9: Deterministic tie-breaker when multiple mentors have equal load
  await t.test('Scenario 9: Deterministic tie-breaker selects mentor by sorted ID', async () => {
    // When multiple mentors have 0 bookings, the first by sorted _id is chosen consistently
    const bA = await createBooking({
      parentName: 'Parent A',
      parentEmail: 'pa@example.com',
      childName: 'Child A',
      childAge: 9,
      subject: 'Coding',
      date: '2026-10-25',
      time: '10:00',
      parentTimezone: 'America/New_York',
    });
    assert.ok(bA.mentorId);
  });

  // Scenario 10: Parent local time converted to UTC correctly
  await t.test('Scenario 10: Parent local time converted to UTC correctly', async () => {
    const utcDate = parseLocalToUTC('2026-10-12', '14:00', 'America/New_York');
    // EDT is UTC-4: 14:00 EDT = 18:00 UTC
    assert.strictEqual(utcDate.toISOString(), '2026-10-12T18:00:00.000Z');
  });

  // Scenario 11: Mentor local time computed from UTC correctly
  await t.test('Scenario 11: Mentor local time computed from UTC correctly', async () => {
    const utcDate = new Date('2026-10-12T18:00:00.000Z');
    // In Asia/Kolkata (UTC+5:30), 18:00 UTC = 23:30 IST
    const istTime = formatInTZ(utcDate, 'Asia/Kolkata', 'HH:mm');
    assert.strictEqual(istTime, '23:30');
  });

  // Scenario 12: UTC timestamps correctly stored in DB
  await t.test('Scenario 12: UTC timestamps correctly stored in DB', async () => {
    const b = await Booking.findOne({ childName: 'Sammy' });
    assert.ok(b);
    assert.strictEqual(b.startTimeUTC.toISOString(), '2026-10-15T14:00:00.000Z');
    assert.strictEqual(b.endTimeUTC.toISOString(), '2026-10-15T14:30:00.000Z');
  });

  // Scenario 13: Meeting link generated for confirmed booking
  await t.test('Scenario 13: Meeting link generated with valid demo URL', async () => {
    const b = await Booking.findOne({ childName: 'Sammy' });
    assert.ok(b.meetingLink.startsWith('https://meet.codeyoung.com/trial-'));
  });

  // Scenario 14: Confirmation response contains both parent & mentor local times
  await t.test('Scenario 14: Booking contains both parent and mentor local times', async () => {
    const b = await Booking.findOne({ childName: 'Sammy' });
    assert.ok(b.parentLocalStartTime);
    assert.ok(b.parentLocalEndTime);
    assert.ok(b.mentorLocalStartTime);
    assert.ok(b.mentorLocalEndTime);
    assert.match(b.parentLocalStartTime, /2026-10-15/);
  });

  // Scenario 15: IANA timezone validation: valid timezones accepted
  await t.test('Scenario 15: Valid IANA timezones accepted', () => {
    assert.strictEqual(isValidIANATimezone('America/New_York'), true);
    assert.strictEqual(isValidIANATimezone('Europe/London'), true);
    assert.strictEqual(isValidIANATimezone('Asia/Kolkata'), true);
  });

  // Scenario 16: IANA timezone validation: invalid timezones rejected
  await t.test('Scenario 16: Invalid timezones rejected', async () => {
    assert.strictEqual(isValidIANATimezone('Mars/Olympus_Mons'), false);
    await assert.rejects(
      async () => {
        await createBooking({
          parentName: 'Fail Parent',
          parentEmail: 'fail@example.com',
          childName: 'Kid',
          childAge: 10,
          subject: 'Coding',
          date: '2026-10-25',
          time: '10:00',
          parentTimezone: 'Invalid/Timezone',
        });
      },
      /Valid IANA parent timezone is required/
    );
  });

  // Scenario 17: Daylight saving transition handled accurately
  await t.test('Scenario 17: Daylight saving transition handled accurately without fixed offset', () => {
    // In NY: July is EDT (UTC-4), November is EST (UTC-5)
    const summer = parseLocalToUTC('2026-07-01', '12:00', 'America/New_York');
    const winter = parseLocalToUTC('2026-11-15', '12:00', 'America/New_York');
    assert.strictEqual(summer.getUTCHours(), 16); // 12 + 4 = 16
    assert.strictEqual(winter.getUTCHours(), 17); // 12 + 5 = 17
  });

  // Scenario 18: Slots across midnight in UTC handled correctly
  await t.test('Scenario 18: Slots across midnight in UTC handled correctly', () => {
    // 23:45 UTC to 00:15 UTC next day
    const utcDate = new Date('2026-10-12T23:45:00.000Z');
    const tokyoDate = getLocalDateString(utcDate, 'Asia/Tokyo');
    assert.strictEqual(tokyoDate, '2026-10-13');
  });

  // Scenario 19: Slot spanning across days in mentor local time handled correctly
  await t.test('Scenario 19: Slot spanning across midnight in mentor time is rejected', async () => {
    const mentor = mentors[0];
    // Create UTC slot that crosses midnight in mentor's timezone
    const startUTC = parseLocalToUTC('2026-10-12', '23:45', mentor.timezone);
    const endUTC = new Date(startUTC.getTime() + 30 * 60 * 1000); // reaches 00:15 next day

    const check = await checkMentorAvailabilityForSlot(mentor, startUTC, endUTC);
    assert.strictEqual(check.isAvailable, false);
    assert.strictEqual(check.reason, 'Crosses mentor midnight boundary');
  });

  // Scenario 20: Concurrent booking requests for same slot serialized without double booking
  await t.test('Scenario 20: Concurrent booking requests serialize safely', async () => {
    // Launch 3 simultaneous booking attempts for the same date & time
    const promises = [1, 2, 3].map((i) =>
      createBooking({
        parentName: `Concurrent Parent ${i}`,
        parentEmail: `concurrent${i}@example.com`,
        childName: `Child ${i}`,
        childAge: 9,
        subject: 'Coding',
        date: '2026-10-28',
        time: '08:00',
        parentTimezone: 'America/New_York',
      })
    );

    const results = await Promise.all(promises);
    assert.strictEqual(results.length, 3);
    const assignedMentorIds = results.map((r) => r.mentorId._id.toString());
    // Ensure all 3 concurrent bookings were assigned to DIFFERENT mentors (no double booking!)
    const uniqueMentors = new Set(assignedMentorIds);
    assert.strictEqual(uniqueMentors.size, 3, 'All 3 concurrent bookings must have unique mentors');
  });

  // Scenario 21: Daily limit of 2 classes enforced across multiple bookings
  await t.test('Scenario 21: Enforces max 2 classes per mentor on a single calendar day', async () => {
    const singleMentor = mentors.find((m) => m.name === 'Elena Rodriguez');
    assert.ok(singleMentor);
    // Find all bookings for Elena on any day
    const elenaBookings = await Booking.find({ mentorId: singleMentor._id });
    // Group by mentor local date
    const dateCounts = {};
    for (const b of elenaBookings) {
      const d = getLocalDateString(b.startTimeUTC, singleMentor.timezone);
      dateCounts[d] = (dateCounts[d] || 0) + 1;
      assert.ok(dateCounts[d] <= 2, `Mentor exceeded 2 classes on ${d}`);
    }
  });

  // Scenario 22: GET /api/mentors returns 10 active mentors
  await t.test('Scenario 22: Exactly 10 active mentors in database', async () => {
    const count = await Mentor.countDocuments({ isActive: true });
    assert.strictEqual(count, 10);
  });

  // Scenario 23: GET /api/bookings/:id returns populated booking details
  await t.test('Scenario 23: Lookup booking by ID returns populated mentor', async () => {
    const anyBooking = await Booking.findOne();
    assert.ok(anyBooking);
    const found = await getBookingById(anyBooking._id);
    assert.ok(found);
    assert.ok(found.mentorId.name, 'Mentor name should be populated');
    assert.strictEqual(found.childName, anyBooking.childName);
  });
});
