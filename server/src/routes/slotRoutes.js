import express from 'express';
import { getAvailableSlotsForDate } from '../services/slotService.js';
import { isValidIANATimezone } from '../utils/timezone.js';

const router = express.Router();

/**
 * GET /api/slots?date=YYYY-MM-DD&timezone=Area/Location
 * Returns 30-minute slots and availability for the requested parent date and timezone.
 */
router.get('/', async (req, res, next) => {
  try {
    const { date, timezone } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "date" (YYYY-MM-DD) is required.',
      });
    }

    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Expected YYYY-MM-DD.',
      });
    }

    if (!timezone) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "timezone" (IANA identifier) is required.',
      });
    }

    if (!isValidIANATimezone(timezone)) {
      return res.status(400).json({
        success: false,
        message: `Invalid or unsupported IANA timezone: "${timezone}".`,
      });
    }

    const slots = await getAvailableSlotsForDate(date, timezone);

    res.json({
      success: true,
      date,
      timezone,
      slotDurationMinutes: 30,
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.isAvailable).length,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
