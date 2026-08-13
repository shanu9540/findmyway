import { Router } from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  toggleWishlist,
  getMyWishlist,
} from '../controllers/destinationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(getDestinations)
  .post(protect, adminOnly, createDestination);

// Wishlist endpoints
router.get('/wishlist/my', protect, getMyWishlist);
router.post('/:id/wishlist', protect, toggleWishlist);

router.route('/:id')
  .get(getDestinationById)
  .put(protect, adminOnly, updateDestination)
  .delete(protect, adminOnly, deleteDestination);

export default router;
