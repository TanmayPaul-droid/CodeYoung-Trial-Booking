import express from 'express';
import { Mentor } from '../models/Mentor.js';

const router = express.Router();

/**
 * GET /api/mentors
 * Returns all active mentors with profile details.
 */
router.get('/', async (req, res, next) => {
  try {
    const mentors = await Mentor.find({ isActive: true }).sort({ rating: -1, name: 1 });
    res.json({
      success: true,
      count: mentors.length,
      data: mentors,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/mentors/:id
 * Returns a specific mentor by ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    res.json({ success: true, data: mentor });
  } catch (error) {
    next(error);
  }
});

export default router;
