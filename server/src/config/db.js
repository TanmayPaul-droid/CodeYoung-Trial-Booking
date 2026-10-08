import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeyoung_booking';
  try {
    await mongoose.connect(uri);
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error.message);
    process.exit(1);
  }
}
