import { Router } from 'express';
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(getPackages)
  .post(protect, adminOnly, createPackage);

router.route('/:id')
  .get(getPackageById)
  .put(protect, adminOnly, updatePackage)
  .delete(protect, adminOnly, deletePackage);

export default router;
