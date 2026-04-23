import FavoriteAuthor from './favoriteAuthor.model.js';
import Author from '../author/author.model.js';

// Get favorite authors
export const getFavoriteAuthors = async (req, res) => {
  try {
    const favorites = await FavoriteAuthor.find({ user: req.user._id })
      .populate('author');

    const authors = favorites.map(f => f.author);
    res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch favorite authors', error: error.message });
  }
};

// Add author to favorites
export const addFavoriteAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;

    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    const existing = await FavoriteAuthor.findOne({ user: req.user._id, author: authorId });
    if (existing) return res.status(400).json({ success: false, message: 'Author already in favorites' });

    await FavoriteAuthor.create({ user: req.user._id, author: authorId });
    res.status(201).json({ success: true, message: 'Author added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add favorite author', error: error.message });
  }
};

// Remove author from favorites
export const removeFavoriteAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;

    const favorite = await FavoriteAuthor.findOne({ user: req.user._id, author: authorId });
    if (!favorite) return res.status(404).json({ success: false, message: 'Author not in favorites' });

    await favorite.deleteOne();
    res.status(200).json({ success: true, message: 'Author removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove favorite author', error: error.message });
  }
};
