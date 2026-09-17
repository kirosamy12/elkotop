import express from 'express';
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from './author.controller.js';
import { protectAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.post('/', protectAdmin, createAuthor);
router.put('/:id', protectAdmin, updateAuthor);
router.delete('/:id', protectAdmin, deleteAuthor);

export default router;
