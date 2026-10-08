import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
      required: true,
      index: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    parentPhone: {
      type: String,
      trim: true,
      default: '',
    },
    childName: {
      type: String,
      required: true,
      trim: true,
    },
    childAge: {
      type: Number,
      required: true,
      min: 4,
      max: 18,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    startTimeUTC: {
      type: Date,
      required: true,
      index: true,
    },
    endTimeUTC: {
      type: Date,
      required: true,
      index: true,
    },
    parentTimezone: {
      type: String,
      required: true,
      trim: true,
    },
    parentLocalStartTime: {
      type: String, // e.g. "2026-10-12 14:00 (EDT)"
    },
    parentLocalEndTime: {
      type: String, // e.g. "2026-10-12 14:30 (EDT)"
    },
    mentorLocalStartTime: {
      type: String, // e.g. "2026-10-12 23:30 (IST)"
    },
    mentorLocalEndTime: {
      type: String, // e.g. "2026-10-13 00:00 (IST)"
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast overlap checks and scheduling queries
bookingSchema.index({ mentorId: 1, startTimeUTC: 1, endTimeUTC: 1 });
bookingSchema.index({ startTimeUTC: 1, endTimeUTC: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
