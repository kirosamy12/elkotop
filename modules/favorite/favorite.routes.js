import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from './favorite.controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getFavorites);
router.post('/:bookId', protect, addFavorite);
router.delete('/:bookId', protect, removeFavorite);

export default router;
