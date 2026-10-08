import express from 'express';
import { createBooking, getBookingById, listBookings } from '../services/bookingService.js';

const router = express.Router();

/**
 * GET /api/bookings
 * Returns existing bookings (sorted by most recent)
 */
router.get('/', async (req, res, next) => {
  try {
    const bookings = await listBookings();
    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/:id
 * Returns booking details by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/bookings
 * Creates a trial class booking and assigns an eligible mentor
 */
router.post('/', async (req, res, next) => {
  try {
    const booking = await createBooking(req.body);
    res.status(201).json({
      success: true,
      message: 'Trial class booked successfully!',
      data: booking,
    });
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
