import express from 'express';
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from './author.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.post('/', protectAdmin, upload.none(), createAuthor);
router.put('/:id', protectAdmin, upload.none(), updateAuthor);
router.delete('/:id', protectAdmin, deleteAuthor);

export default router;
