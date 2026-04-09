import Favorite from './favorite.model.js';
import Book from '../book/book.model.js';
import Category from '../category/category.model.js';
import Author from '../author/author.model.js';

const bookIncludes = {
  include: [
    { model: Category, as: 'category', attributes: ['id', 'title'] },
    { model: Author, as: 'author', attributes: ['id', 'name', 'image'] }
  ]
};

// Get user favorites
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{ model: Book, as: 'book', ...bookIncludes }]
    });

    const books = favorites.map(f => f.book);

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch favorites', error: error.message });
  }
};

// Add book to favorites
export const addFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const existing = await Favorite.findOne({ where: { userId: req.user.id, bookId } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Book already in favorites' });
    }

    await Favorite.create({ userId: req.user.id, bookId });

    res.status(201).json({ success: true, message: 'Book added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add favorite', error: error.message });
  }
};

// Remove book from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;

    const favorite = await Favorite.findOne({ where: { userId: req.user.id, bookId } });
    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Book not in favorites' });
    }

    await favorite.destroy();

    res.status(200).json({ success: true, message: 'Book removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove favorite', error: error.message });
  }
};
