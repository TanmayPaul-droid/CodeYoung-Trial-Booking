import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import mentorRoutes from './routes/mentorRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { seed } from './scripts/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CodeYoung Trial Class Booking API',
  });
});

// API Routes
app.use('/api/mentors', mentorRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);

// Optional Dev Reset Endpoint
app.post('/api/reset-seed', async (req, res, next) => {
  try {
    const mentors = await seed();
    res.json({ success: true, message: 'Database reseeded successfully', count: mentors.length });
  } catch (err) {
    next(err);
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CodeYoung API Server running on http://localhost:${PORT}`);
  });
});

export default app;
