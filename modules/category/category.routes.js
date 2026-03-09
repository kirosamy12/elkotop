import express from 'express';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from './category.controller.js';
import { protectAdmin, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', protectAdmin, authorize('admin'), createCategory);
router.put('/:id', protectAdmin, authorize('admin'), updateCategory);
router.delete('/:id', protectAdmin, authorize('admin'), deleteCategory);

export default router;
