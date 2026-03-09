import Book from './book.model.js';
import Category from '../category/category.model.js';
import cloudinary from '../../config/cloudinary.js';

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('category', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message
    });
  }
};

// Get single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'title');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book',
      error: error.message
    });
  }
};

// Get books by author
export const getBooksByAuthor = async (req, res) => {
  try {
    const { author } = req.params;

    const books = await Book.find({ 
      author: { $regex: author, $options: 'i' } 
    }).populate('category', 'title');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books by author',
      error: error.message
    });
  }
};

// Search books by title or author
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    }).populate('category', 'title');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search books',
      error: error.message
    });
  }
};

// Create book (Admin only)
export const createBook = async (req, res) => {
  try {
    const { title, author, description, releaseDate, category } = req.body;

    // Validate required fields
    if (!title || !author || !description || !releaseDate || !category) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if files are uploaded
    if (!req.files || !req.files.coverImage || !req.files.pdfFile) {
      return res.status(400).json({
        success: false,
        message: 'Cover image and PDF file are required'
      });
    }

    // Upload cover image to Cloudinary
    const coverImageResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'books/covers',
          transformation: [
            { width: 800, height: 1200, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.files.coverImage[0].buffer);
    });

    // Upload PDF to Cloudinary
    const pdfResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'books/pdfs',
          resource_type: 'raw',
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.files.pdfFile[0].buffer);
    });

    // Create book
    const book = await Book.create({
      title,
      author,
      description,
      releaseDate,
      category,
      coverImage: coverImageResult.secure_url,
      pdfFile: pdfResult.secure_url
    });

    const populatedBook = await Book.findById(book._id).populate('category', 'title');

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: populatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message
    });
  }
};

// Update book (Admin only)
export const updateBook = async (req, res) => {
  try {
    const { title, author, description, releaseDate, category } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (releaseDate) book.releaseDate = releaseDate;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      book.category = category;
    }

    // Update cover image if provided
    if (req.files && req.files.coverImage) {
      const coverImageResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'books/covers',
            transformation: [
              { width: 800, height: 1200, crop: 'fill' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.files.coverImage[0].buffer);
      });
      book.coverImage = coverImageResult.secure_url;
    }

    // Update PDF if provided
    if (req.files && req.files.pdfFile) {
      const pdfResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'books/pdfs',
            resource_type: 'raw',
            format: 'pdf'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.files.pdfFile[0].buffer);
      });
      book.pdfFile = pdfResult.secure_url;
    }

    await book.save();

    const updatedBook = await Book.findById(book._id).populate('category', 'title');

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error.message
    });
  }
};

// Delete book (Admin only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message
    });
  }
};
