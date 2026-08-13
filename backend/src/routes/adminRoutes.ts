import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

// Apply admin protection to all routes in this file
router.use(protect, adminOnly);

router.get('/dashboard-stats', getDashboardStats);
router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .delete(deleteUser);

router.put('/users/:id/role', updateUserRole);

export default router;
