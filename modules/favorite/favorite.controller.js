import Favorite from './favorite.model.js';
import Book from '../book/book.model.js';

const populate = [
  { path: 'category', select: 'id title' },
  { path: 'author', select: 'id name image' }
];

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate({ path: 'book', populate });
    const books = favorites.map(f => f.book);
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch favorites', error: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    const existing = await Favorite.findOne({ user: req.user._id, book: bookId });
    if (existing) return res.status(400).json({ success: false, message: 'Book already in favorites' });

    await Favorite.create({ user: req.user._id, book: bookId });
    res.status(201).json({ success: true, message: 'Book added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add favorite', error: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;

    const favorite = await Favorite.findOne({ user: req.user._id, book: bookId });
    if (!favorite) return res.status(404).json({ success: false, message: 'Book not in favorites' });

    await favorite.deleteOne();
    res.status(200).json({ success: true, message: 'Book removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove favorite', error: error.message });
  }
};
