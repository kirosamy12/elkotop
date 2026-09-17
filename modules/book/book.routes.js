import express from 'express';
import {
  getAllBooks,
  getBookById,
  getBooksByAuthor,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
  getRelatedBooks
} from './book.controller.js';
import { protectAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/author/:authorId', getBooksByAuthor);
router.get('/:id/related', getRelatedBooks);
router.get('/:id', getBookById);

// Admin only routes
router.post('/', protectAdmin, createBook);
router.put('/:id', protectAdmin, updateBook);
router.delete('/:id', protectAdmin, deleteBook);

export default router;
