import { Router } from 'express';
import { getFlightOffers, bookFlight, revalidateFlightOffer, getMyDuffelBookings } from '../controllers/flightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/search', getFlightOffers);
router.get('/revalidate/:offerId', revalidateFlightOffer);
router.post('/book', protect, bookFlight);
router.get('/my-bookings', protect, getMyDuffelBookings);

export default router;
