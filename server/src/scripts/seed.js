
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Mentor } from '../models/Mentor.js';
import { connectDB } from '../config/db.js';

dotenv.config();

// 10 sample mentors:
// 6 India + 1 Nigeria + 1 Indonesia + 1 Kenya + 1 Philippines.
export const seedMentorsData = [
  // INDIA — 6 mentors
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@codeyoung.com',
    timezone: 'Asia/Kolkata',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    subjects: ['Python Programming', 'Robotics & Arduino', 'Scratch Coding'],
    rating: 4.98,
    reviewCount: 312,
    experienceYears: 6,
    bio: 'STEM mentor focused on introductory programming, robotics, and hands-on projects.',
    isActive: true,
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@codeyoung.com',
    timezone: 'Asia/Kolkata',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    subjects: ['Python Programming', 'AI & Machine Learning', 'Creative Coding'],
    rating: 4.95,
    reviewCount: 248,
    experienceYears: 5,
    bio: 'Sample mentor profile for Python, AI concepts, and creative coding activities.',
    isActive: true,
  },
  {
    name: 'Rohan Das',
    email: 'rohan.das@codeyoung.com',
    timezone: 'Asia/Kolkata',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    subjects: ['Web Development', 'HTML/CSS/JS', 'Frontend Apps'],
    rating: 4.92,
    reviewCount: 195,
    experienceYears: 4,
    bio: 'Sample mentor profile focused on building beginner-friendly web applications.',
    isActive: true,
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@codeyoung.com',
    timezone: 'Asia/Kolkata',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    subjects: ['Scratch Coding', 'Game Development', 'Creative Animation'],
    rating: 4.97,
    reviewCount: 280,
    experienceYears: 7,
    bio: 'Sample mentor profile focused on animation, interactive stories, and beginner game design.',
    isActive: true,
  },
  {
    name: 'Vikram Patel',
    email: 'vikram.patel@codeyoung.com',
    timezone: 'Asia/Kolkata',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    subjects: ['Robotics & Arduino', 'Python Programming', 'Algorithmic Puzzles'],
    rating: 4.94,
    reviewCount: 205,
    experienceYears: 5,
    bio: 'Sample mentor profile for robotics, computational thinking, and programming projects.',
    isActive: true,
  },
  {
    name: 'Meera Nair',
    email: 'meera.nair@codeyoung.com',
    timezone: 'Asia/Kolkata',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    subjects: ['Python Data Science', 'AI & Machine Learning', 'Computational Math'],
    rating: 4.96,
    reviewCount: 220,
    experienceYears: 5,
    bio: 'Sample mentor profile focused on data, logical reasoning, and introductory AI concepts.',
    isActive: true,
  },

  // NIGERIA — 1 mentor
  {
    name: 'Chinedu Okafor',
    email: 'chinedu.okafor@codeyoung.com',
    timezone: 'Africa/Lagos',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    subjects: ['Python Programming', 'Web Development', 'Scratch Coding'],
    rating: 4.93,
    reviewCount: 160,
    experienceYears: 4,
    bio: 'Sample mentor profile for introductory coding and web development.',
    isActive: true,
  },

  // INDONESIA — 1 mentor
  {
    name: 'Dewi Putri',
    email: 'dewi.putri@codeyoung.com',
    timezone: 'Asia/Jakarta',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    subjects: ['Scratch Coding', 'Game Development', 'Creative Animation'],
    rating: 4.91,
    reviewCount: 145,
    experienceYears: 4,
    bio: 'Sample mentor profile focused on beginner game design and creative programming.',
    isActive: true,
  },

  // KENYA — 1 mentor
  {
    name: 'Wanjiku Kamau',
    email: 'wanjiku.kamau@codeyoung.com',
    timezone: 'Africa/Nairobi',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80',
    subjects: ['Python Programming', 'Robotics & Sensors', 'Algorithmic Puzzles'],
    rating: 4.92,
    reviewCount: 132,
    experienceYears: 5,
    bio: 'Sample mentor profile for programming fundamentals and computational problem-solving.',
    isActive: true,
  },

  // THE PHILIPPINES — 1 mentor
  {
    name: 'Miguel Santos',
    email: 'miguel.santos@codeyoung.com',
    timezone: 'Asia/Manila',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    subjects: ['Web Development', 'HTML/CSS/JS', 'Game Development'],
    rating: 4.90,
    reviewCount: 128,
    experienceYears: 4,
    bio: 'Sample mentor profile focused on beginner websites and interactive projects.',
    isActive: true,
  },
];

/**
 * Safely synchronizes the seeded mentor profiles.
 *
 * Existing bookings are preserved. Existing mentors not included
 * in the seed list are deactivated instead of being deleted.
 */
export async function seed() {
  await connectDB();

  try {
    console.log('[Seed] Synchronizing mentor profiles...');

    // Keep existing mentor documents and booking references intact.
    await Mentor.updateMany(
      {},
      { $set: { isActive: false } }
    );

    // Insert new profiles or update matching emails.
    for (const mentorData of seedMentorsData) {
      await Mentor.updateOne(
        { email: mentorData.email },
        { $set: mentorData },
        { upsert: true, runValidators: true }
      );
    }

    const activeMentors = await Mentor.find({
      isActive: true,
    }).sort({ timezone: 1, name: 1 });

    console.log(
      `[Seed] Active mentors after synchronization: ${activeMentors.length}`
    );

    activeMentors.forEach((mentor, index) => {
      console.log(
        `${index + 1}. ${mentor.name} | ` +
        `TZ: ${mentor.timezone} | ` +
        `Hours: ${mentor.operatingHours.start}-` +
        `${mentor.operatingHours.end}`
      );
    });

    return activeMentors;
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      await mongoose.disconnect();
      console.log('[Seed] Database disconnected.');
    }
  }
}

if (process.argv[1]?.endsWith('seed.js')) {
  seed()
    .then(() => process.exit(0))
    .catch(async (error) => {
      console.error('[Seed] Error synchronizing mentors:', error);

      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }

      process.exit(1);
    });
}
