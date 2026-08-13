import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .post(protect, createReview)
  .get(getReviews);

export default router;
