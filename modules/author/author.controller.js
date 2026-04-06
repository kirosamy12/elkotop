import Author from './author.model.js';
import Book from '../book/book.model.js';
import cloudinary from '../../config/cloudinary.js';

// Get all authors
export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({ order: [['name', 'ASC']] });

    res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch authors', error: error.message });
  }
};

// Get author by ID with their books
export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);

    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    const books = await Book.findAll({ where: { authorId: req.params.id } });

    res.status(200).json({
      success: true,
      data: { ...author.toJSON(), books }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch author', error: error.message });
  }
};

// Create author (Admin only)
export const createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Author name is required' });
    }

    let avatarUrl = '';

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'authors', transformation: [{ width: 500, height: 500, crop: 'fill' }, { quality: 'auto' }] },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.file.buffer);
      });
      avatarUrl = result.secure_url;
    }

    const author = await Author.create({ name, bio, avatar: avatarUrl });

    res.status(201).json({ success: true, message: 'Author created successfully', data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create author', error: error.message });
  }
};

// Update author (Admin only)
export const updateAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const author = await Author.findByPk(req.params.id);

    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'authors', transformation: [{ width: 500, height: 500, crop: 'fill' }, { quality: 'auto' }] },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.file.buffer);
      });
      updates.avatar = result.secure_url;
    }

    await author.update(updates);

    res.status(200).json({ success: true, message: 'Author updated successfully', data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update author', error: error.message });
  }
};

// Delete author (Admin only)
export const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);

    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    const booksCount = await Book.count({ where: { authorId: req.params.id } });
    if (booksCount > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete author. They have ${booksCount} book(s)` });
    }

    await author.destroy();
    res.status(200).json({ success: true, message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete author', error: error.message });
  }
};
