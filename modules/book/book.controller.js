import Book from './book.model.js';
import Category from '../category/category.model.js';
import Author from '../author/author.model.js';

const populate = [
  { path: 'category', select: 'id title' },
  { path: 'author', select: 'id name image' }
];

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate(populate).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(populate);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch book', error: error.message });
  }
};

export const getBooksByAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.authorId);
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    const books = await Book.find({ author: req.params.authorId }).populate(populate);
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books by author', error: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });

    const books = await Book.find({ title: { $regex: query, $options: 'i' } }).populate(populate);
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search books', error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
export const createBook = async (req, res) => {
  try {
    const { title, description, releaseDate, categoryId, authorId, coverImage, pdfFile } = req.body;

    if (!title || !description || !releaseDate || !categoryId || !authorId || !coverImage || !pdfFile) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!await Category.findById(categoryId)) return res.status(404).json({ success: false, message: 'Category not found' });
    if (!await Author.findById(authorId)) return res.status(404).json({ success: false, message: 'Author not found' });

    const book = await Book.create({
      title, description, releaseDate,
      category: categoryId,
      author: authorId,
      coverImage,
      pdfFile
    });

    const populated = await Book.findById(book._id).populate(populate);
    res.status(201).json({ success: true, message: 'Book created successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, description, releaseDate, category, author, coverImage, pdfFile } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (releaseDate) updates.releaseDate = releaseDate;
    if (coverImage) updates.coverImage = coverImage;
    if (pdfFile) updates.pdfFile = pdfFile;
    if (category) {
      if (!await Category.findById(category)) return res.status(404).json({ success: false, message: 'Category not found' });
      updates.category = category;
    }
    if (author) {
      if (!await Author.findById(author)) return res.status(404).json({ success: false, message: 'Author not found' });
      updates.author = author;
    }

    const updated = await Book.findByIdAndUpdate(req.params.id, updates, { new: true }).populate(populate);
    res.status(200).json({ success: true, message: 'Book updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    await book.deleteOne();
    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete book', error: error.message });
  }
};

// Get related books (same category, exclude current book)
export const getRelatedBooks = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    const related = await Book.find({
      category: book.category,
      _id: { $ne: book._id }
    }).populate(populate).limit(6);

    res.status(200).json({ success: true, count: related.length, data: related });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch related books', error: error.message });
  }
};
