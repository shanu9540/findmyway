import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  confirmMockPayment,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

// User bookings
router.route('/')
  .post(protect, createBooking)
  .get(protect, adminOnly, getAllBookings); // Admins get all bookings via GET /

router.get('/my-bookings', protect, getMyBookings);
router.post('/:id/confirm-mock', protect, confirmMockPayment);

// Admin endpoints
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

export default router;
