import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Mentor } from '../models/Mentor.js';
import { Booking } from '../models/Booking.js';
import { connectDB } from '../config/db.js';

dotenv.config();

export const seedMentorsData = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@codeyoung.com',
    timezone: 'Asia/Kolkata',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    subjects: ['Python Programming', 'Robotics & Arduino', 'Scratch Coding'],
    rating: 4.98,
    reviewCount: 312,
    experienceYears: 6,
    bio: 'Senior STEM educator specializing in hands-on block and Python programming for curious young minds.',
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@codeyoung.com',
    timezone: 'America/New_York',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    subjects: ['Scratch Coding', 'Game Development', 'Creative Animation'],
    rating: 4.95,
    reviewCount: 248,
    experienceYears: 5,
    bio: 'MIT Media Lab trained curriculum specialist passionate about making code fun and intuitive.',
  },
  {
    name: 'Marcus Chen',
    email: 'marcus.chen@codeyoung.com',
    timezone: 'Asia/Singapore',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    subjects: ['Web Development', 'HTML/CSS/JS', 'Frontend Apps'],
    rating: 4.92,
    reviewCount: 195,
    experienceYears: 4,
    bio: 'Full-stack software engineer turned educator who coaches junior coders to ship real web apps.',
  },
  {
    name: 'Emily Watson',
    email: 'emily.watson@codeyoung.com',
    timezone: 'Europe/London',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    subjects: ['AI & Machine Learning', 'Python Data Science', 'Computational Math'],
    rating: 4.97,
    reviewCount: 280,
    experienceYears: 7,
    bio: 'Oxford computer science alumnus focused on demystifying artificial intelligence for children aged 8-16.',
  },
  {
    name: 'David Miller',
    email: 'david.miller@codeyoung.com',
    timezone: 'America/Los_Angeles',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    subjects: ['App Development', 'Mobile UI/UX', 'Python for Kids'],
    rating: 4.89,
    reviewCount: 174,
    experienceYears: 4,
    bio: 'Silicon Valley tech veteran helping students build their first interactive iOS & Android prototypes.',
  },
  {
    name: 'Sophia Becker',
    email: 'sophia.becker@codeyoung.com',
    timezone: 'Europe/Berlin',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    subjects: ['Mathematical Thinking', 'Algorithmic Puzzles', 'Python Coding'],
    rating: 4.96,
    reviewCount: 220,
    experienceYears: 5,
    bio: 'Passionate about logic, spatial thinking, and developing problem-solving resilience in children.',
  },
  {
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@codeyoung.com',
    timezone: 'Australia/Sydney',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    subjects: ['Robotics & Micro:bit', 'Game Design', 'Scratch Coding'],
    rating: 4.94,
    reviewCount: 205,
    experienceYears: 5,
    bio: 'Hardware tinkerer and educator teaching creative electronics, robotics, and interactive game physics.',
  },
  {
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@codeyoung.com',
    timezone: 'Asia/Tokyo',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    subjects: ['Python Programming', 'Robotics & Sensors', 'Game Architecture'],
    rating: 4.99,
    reviewCount: 340,
    experienceYears: 8,
    bio: 'Veteran international coding mentor fostering deep critical thinking and creative project design.',
  },
  {
    name: 'Amira Al-Mansoor',
    email: 'amira.almansoor@codeyoung.com',
    timezone: 'Asia/Dubai',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    subjects: ['Creative Coding', 'Scratch & Animation', 'Web Development'],
    rating: 4.93,
    reviewCount: 160,
    experienceYears: 4,
    bio: 'Dedicated to empowering the next generation of digital innovators with fun, project-based learning.',
  },
  {
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@codeyoung.com',
    timezone: 'America/Chicago',
    operatingHours: { start: '09:00', end: '17:00' },
    maxDailyClasses: 2,
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed25a075?auto=format&fit=crop&w=300&q=80',
    subjects: ['Scratch Coding', 'Game Development', 'Python Basics'],
    rating: 4.91,
    reviewCount: 188,
    experienceYears: 4,
    bio: 'Interactive design enthusiast helping beginners turn their wildest game ideas into working code.',
  },
];

export async function seed() {
  await connectDB();
  console.log('[Seed] Clearing existing mentors and bookings...');
  await Booking.deleteMany({});
  await Mentor.deleteMany({});

  console.log('[Seed] Inserting 10 global mentors...');
  const mentors = await Mentor.insertMany(seedMentorsData);
  console.log(`[Seed] Successfully seeded ${mentors.length} mentors!`);

  mentors.forEach((m, idx) => {
    console.log(`  ${idx + 1}. ${m.name} | TZ: ${m.timezone} | Hours: ${m.operatingHours.start}-${m.operatingHours.end}`);
  });

  if (process.env.NODE_ENV !== 'test') {
    await mongoose.disconnect();
    console.log('[Seed] Database disconnected.');
  }
  return mentors;
}

if (process.argv[1]?.endsWith('seed.js')) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed] Error seeding database:', err);
      process.exit(1);
    });
}
