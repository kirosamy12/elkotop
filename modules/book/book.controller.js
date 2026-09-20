import prisma from '../../config/db.js';
import { uploadToBunny } from '../../config/bunny.js';
import { randomUUID } from 'crypto';

const bookInclude = {
  include: {
    category: { select: { id: true, title: true } },
    author: { select: { id: true, name: true, image: true } }
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({ ...bookInclude, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: parseInt(req.params.id) }, ...bookInclude });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch book', error: error.message });
  }
};

export const getBooksByAuthor = async (req, res) => {
  try {
    const author = await prisma.author.findUnique({ where: { id: parseInt(req.params.authorId) } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });
    const books = await prisma.book.findMany({ where: { authorId: parseInt(req.params.authorId) }, ...bookInclude });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books by author', error: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });
    const books = await prisma.book.findMany({ where: { title: { contains: query, mode: 'insensitive' } }, ...bookInclude });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search books', error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, description, releaseDate, categoryId, authorId, fileUrl } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    if (!description) return res.status(400).json({ success: false, message: 'Description is required' });
    if (!releaseDate) return res.status(400).json({ success: false, message: 'Release date is required' });
    if (!categoryId) return res.status(400).json({ success: false, message: 'Category ID is required' });
    if (!authorId) return res.status(400).json({ success: false, message: 'Author ID is required' });
    if (!fileUrl) return res.status(400).json({ success: false, message: 'PDF file URL is required' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Cover image is required' });

    const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const author = await prisma.author.findUnique({ where: { id: parseInt(authorId) } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    // Upload cover image to BunnyCDN
    const coverName = `${randomUUID()}.${req.file.originalname.split('.').pop()}`;
    const coverImage = await uploadToBunny(req.file.buffer, coverName, 'books/covers');

    const book = await prisma.book.create({
      data: { title, description, releaseDate: new Date(releaseDate), categoryId: parseInt(categoryId), authorId: parseInt(authorId), coverImage, fileUrl },
      ...bookInclude
    });
    res.status(201).json({ success: true, message: 'Book created successfully', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, description, releaseDate, category, author, fileUrl } = req.body;
    const book = await prisma.book.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    const data = {};
    if (title) data.title = title;
    if (description) data.description = description;
    if (releaseDate) data.releaseDate = new Date(releaseDate);
    if (req.file) {
      const coverName = `${randomUUID()}.${req.file.originalname.split('.').pop()}`;
      data.coverImage = await uploadToBunny(req.file.buffer, coverName, 'books/covers');
    }
    if (fileUrl) data.fileUrl = fileUrl;
    if (category) {
      if (!await prisma.category.findUnique({ where: { id: parseInt(category) } })) return res.status(404).json({ success: false, message: 'Category not found' });
      data.categoryId = parseInt(category);
    }
    if (author) {
      if (!await prisma.author.findUnique({ where: { id: parseInt(author) } })) return res.status(404).json({ success: false, message: 'Author not found' });
      data.authorId = parseInt(author);
    }

    const updated = await prisma.book.update({ where: { id: parseInt(req.params.id) }, data, ...bookInclude });
    res.status(200).json({ success: true, message: 'Book updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    await prisma.book.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete book', error: error.message });
  }
};

export const getRelatedBooks = async (req, res) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    const related = await prisma.book.findMany({ where: { categoryId: book.categoryId, NOT: { id: book.id } }, take: 6, ...bookInclude });
    res.status(200).json({ success: true, count: related.length, data: related });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch related books', error: error.message });
  }
};
