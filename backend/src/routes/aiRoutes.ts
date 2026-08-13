import { Router } from 'express';
import {
  handleGenerateItinerary,
  handleEstimateBudget,
  handleChat,
  getMyItineraries,
} from '../controllers/aiController.js';
import { optionalProtect, protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter specifically for AI endpoints to prevent API key abuse
const aiLimiter = rateLimit({
  windowMs: 60 * 1000 * 15, // 15 minutes
  limit: 20, // Max 20 requests per 15 minutes per IP
  message: { message: 'Too many requests to AI services, please try again after 15 minutes.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

router.post('/generate-itinerary', aiLimiter, optionalProtect, handleGenerateItinerary);
router.post('/estimate-budget', aiLimiter, handleEstimateBudget);
router.post('/chat', aiLimiter, handleChat);
router.get('/my-itineraries', protect, getMyItineraries);

export default router;
