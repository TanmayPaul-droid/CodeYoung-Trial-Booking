import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    timezone: {
      type: String,
      required: true,
      trim: true,
      // Must be a valid IANA timezone identifier
    },
    operatingHours: {
      start: {
        type: String,
        required: true,
        default: '09:00', // Mentor local start time HH:mm
      },
      end: {
        type: String,
        required: true,
        default: '17:00', // Mentor local end time HH:mm
      },
    },
    maxDailyClasses: {
      type: Number,
      required: true,
      default: 2, // Maximum classes per calendar day in mentor local timezone
    },
    avatar: {
      type: String,
      default: '',
    },
    subjects: {
      type: [String],
      default: ['Scratch & Python', 'Web Development', 'Robotics', 'AI & Machine Learning'],
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 120,
    },
    experienceYears: {
      type: Number,
      default: 4,
    },
    bio: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

mentorSchema.index({ timezone: 1 });

export const Mentor = mongoose.model('Mentor', mentorSchema);
