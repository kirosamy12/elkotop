import express from 'express';
import {
  getAllBooks,
  getBookById,
  getBooksByAuthor,
  searchBooks,
  createBook,
  updateBook,
  deleteBook
} from './book.controller.js';
import { protectAdmin, authorize } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/author/:authorId', getBooksByAuthor);
router.get('/:id', getBookById);

// Admin only routes
router.post(
  '/',
  protectAdmin,
  authorize('admin'),
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
  ]),
  createBook
);

router.put(
  '/:id',
  protectAdmin,
  authorize('admin'),
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
  ]),
  updateBook
);

router.delete('/:id', protectAdmin, authorize('admin'), deleteBook);

export default router;
