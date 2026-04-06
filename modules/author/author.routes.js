import express from 'express';
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from './author.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);

// Admin only
router.post('/', protectAdmin, upload.single('avatar'), createAuthor);
router.put('/:id', protectAdmin, upload.single('avatar'), updateAuthor);
router.delete('/:id', protectAdmin, deleteAuthor);

export default router;
