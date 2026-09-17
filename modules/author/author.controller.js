import Author from './author.model.js';
import Book from '../book/book.model.js';

export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch authors', error: error.message });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    const books = await Book.find({ author: req.params.id }).populate('category', 'title');
    res.status(200).json({ success: true, data: { ...author.toObject(), books } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch author', error: error.message });
  }
};

export const createAuthor = async (req, res) => {
  try {
    const { name, bio, image } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Author name is required' });

    const author = await Author.create({ name, bio, image: image || '' });
    res.status(201).json({ success: true, message: 'Author created successfully', data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create author', error: error.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const { name, bio, image } = req.body;
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (image) updates.image = image;

    const updated = await Author.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Author updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update author', error: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    const booksCount = await Book.countDocuments({ author: req.params.id });
    if (booksCount > 0) return res.status(400).json({ success: false, message: `Cannot delete author. They have ${booksCount} book(s)` });

    await author.deleteOne();
    res.status(200).json({ success: true, message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete author', error: error.message });
  }
};
