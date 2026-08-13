import { Router } from 'express';
import { getHotelOffers } from '../controllers/hotelController.js';

const router = Router();

router.get('/search', getHotelOffers);

export default router;
