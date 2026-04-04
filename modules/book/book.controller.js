import { Op } from 'sequelize';
import Book from './book.model.js';
import Category from '../category/category.model.js';
import cloudinary from '../../config/cloudinary.js';

const bookWithCategory = { include: [{ model: Category, as: 'category', attributes: ['id', 'title'] }] };

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ ...bookWithCategory, order: [['createdAt', 'DESC']] });

    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books', error: error.message });
  }
};

// Get single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, bookWithCategory);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch book', error: error.message });
  }
};

// Get books by author
export const getBooksByAuthor = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { author: { [Op.like]: `%${req.params.author}%` } },
      ...bookWithCategory
    });

    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books by author', error: error.message });
  }
};

// Search books
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } }
        ]
      },
      ...bookWithCategory
    });

    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search books', error: error.message });
  }
};

// Create book (Admin only)
export const createBook = async (req, res) => {
  try {
    const { title, author, description, releaseDate, category } = req.body;

    if (!title || !author || !description || !releaseDate || !category) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const categoryExists = await Category.findByPk(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (!req.files || !req.files.coverImage || !req.files.pdfFile) {
      return res.status(400).json({ success: false, message: 'Cover image and PDF file are required' });
    }

    // Upload cover image
    const coverImageResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'books/covers', transformation: [{ width: 800, height: 1200, crop: 'fill' }, { quality: 'auto' }] },
        (error, result) => { if (error) reject(error); else resolve(result); }
      );
      stream.end(req.files.coverImage[0].buffer);
    });

    // Upload PDF
    const pdfResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'books/pdfs', resource_type: 'raw', format: 'pdf' },
        (error, result) => { if (error) reject(error); else resolve(result); }
      );
      stream.end(req.files.pdfFile[0].buffer);
    });

    const book = await Book.create({
      title, author, description, releaseDate,
      categoryId: category,
      coverImage: coverImageResult.secure_url,
      pdfFile: pdfResult.secure_url
    });

    const populatedBook = await Book.findByPk(book.id, bookWithCategory);

    res.status(201).json({ success: true, message: 'Book created successfully', data: populatedBook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
  }
};

// Update book (Admin only)
export const updateBook = async (req, res) => {
  try {
    const { title, author, description, releaseDate, category } = req.body;
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (author) updates.author = author;
    if (description) updates.description = description;
    if (releaseDate) updates.releaseDate = releaseDate;
    if (category) {
      const categoryExists = await Category.findByPk(category);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      updates.categoryId = category;
    }

    if (req.files?.coverImage) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'books/covers', transformation: [{ width: 800, height: 1200, crop: 'fill' }, { quality: 'auto' }] },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.files.coverImage[0].buffer);
      });
      updates.coverImage = result.secure_url;
    }

    if (req.files?.pdfFile) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'books/pdfs', resource_type: 'raw', format: 'pdf' },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.files.pdfFile[0].buffer);
      });
      updates.pdfFile = result.secure_url;
    }

    await book.update(updates);
    const updatedBook = await Book.findByPk(book.id, bookWithCategory);

    res.status(200).json({ success: true, message: 'Book updated successfully', data: updatedBook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update book', error: error.message });
  }
};

// Delete book (Admin only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    await book.destroy();
    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete book', error: error.message });
  }
};
