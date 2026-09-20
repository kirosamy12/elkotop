import express from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from './category.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', protectAdmin, upload.any(), createCategory);
router.put('/:id', protectAdmin, upload.any(), updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;
