import { Router } from 'express';
import { getStays, getStayDetails, getStayRooms, bookStay } from '../controllers/stayController.js';

const router = Router();

router.get('/search', getStays);
router.get('/:id', getStayDetails);
router.get('/:id/rooms', getStayRooms);
router.post('/book', bookStay);

export default router;
