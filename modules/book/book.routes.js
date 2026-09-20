import express from 'express';
import { getAllBooks, getBookById, getBooksByAuthor, searchBooks, createBook, updateBook, deleteBook, getRelatedBooks } from './book.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/author/:authorId', getBooksByAuthor);
router.get('/:id/related', getRelatedBooks);
router.get('/:id', getBookById);

// Admin only routes
router.post('/', protectAdmin, upload.none(), createBook);
router.put('/:id', protectAdmin, upload.none(), updateBook);
router.delete('/:id', protectAdmin, deleteBook);

export default router;
