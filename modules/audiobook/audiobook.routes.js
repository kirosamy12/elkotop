import express from 'express';
import {
  getAllAudioBooks,
  getAudioBookById,
  getAudioBooksByAuthor,
  searchAudioBooks,
  createAudioBook,
  updateAudioBook,
  deleteAudioBook
} from './audiobook.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', getAllAudioBooks);
router.get('/search', searchAudioBooks);
router.get('/author/:authorId', getAudioBooksByAuthor);
router.get('/:id', getAudioBookById);

// Admin only routes
router.post('/', protectAdmin, upload.single('coverImage'), createAudioBook);
router.put('/:id', protectAdmin, upload.single('coverImage'), updateAudioBook);
router.delete('/:id', protectAdmin, deleteAudioBook);

export default router;
