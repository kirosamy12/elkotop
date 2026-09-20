import express from 'express';
import { getAllBooks, getBookById, getBooksByAuthor, searchBooks, createBook, updateBook, deleteBook, getRelatedBooks } from './book.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/author/:authorId', getBooksByAuthor);
router.get('/:id/related', getRelatedBooks);
router.get('/:id', getBookById);

// Admin only routes - coverImage as file, pdfFile as text URL
router.post('/', protectAdmin, upload.single('coverImage'), createBook);
router.put('/:id', protectAdmin, upload.single('coverImage'), updateBook);
router.delete('/:id', protectAdmin, deleteBook);

export default router;
