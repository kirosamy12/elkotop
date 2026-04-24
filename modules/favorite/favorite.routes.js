import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from './favorite.controller.js';
import { getFavoriteAuthors, addFavoriteAuthor, removeFavoriteAuthor } from './favoriteAuthor.controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

// Favorite Books (original routes)
router.get('/', protect, getFavorites);
router.post('/:bookId', protect, addFavorite);
router.delete('/:bookId', protect, removeFavorite);

// Favorite Authors (new routes)
router.get('/authors', protect, getFavoriteAuthors);
router.post('/authors/:authorId', protect, addFavoriteAuthor);
router.delete('/authors/:authorId', protect, removeFavoriteAuthor);

export default router;
