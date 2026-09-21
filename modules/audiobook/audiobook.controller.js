import prisma from '../../config/db.js';
import { uploadToBunny } from '../../config/bunny.js';
import { randomUUID } from 'crypto';

const audioBookInclude = {
  include: {
    category: { select: { id: true, title: true } },
    author: { select: { id: true, name: true, image: true } }
  }
};

// Get all audiobooks
export const getAllAudioBooks = async (req, res) => {
  try {
    const audioBooks = await prisma.audioBook.findMany({ ...audioBookInclude, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, count: audioBooks.length, data: audioBooks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audiobooks', error: error.message });
  }
};

// Get single audiobook
export const getAudioBookById = async (req, res) => {
  try {
    const audioBook = await prisma.audioBook.findUnique({ where: { id: parseInt(req.params.id) }, ...audioBookInclude });
    if (!audioBook) return res.status(404).json({ success: false, message: 'Audiobook not found' });
    res.status(200).json({ success: true, data: audioBook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audiobook', error: error.message });
  }
};

// Get audiobooks by author
export const getAudioBooksByAuthor = async (req, res) => {
  try {
    const author = await prisma.author.findUnique({ where: { id: parseInt(req.params.authorId) } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });
    const audioBooks = await prisma.audioBook.findMany({ where: { authorId: parseInt(req.params.authorId) }, ...audioBookInclude });
    res.status(200).json({ success: true, count: audioBooks.length, data: audioBooks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audiobooks by author', error: error.message });
  }
};

// Search audiobooks
export const searchAudioBooks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });
    const audioBooks = await prisma.audioBook.findMany({
      where: { title: { contains: query, mode: 'insensitive' } },
      ...audioBookInclude
    });
    res.status(200).json({ success: true, count: audioBooks.length, data: audioBooks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search audiobooks', error: error.message });
  }
};

// Create audiobook (Admin only)
export const createAudioBook = async (req, res) => {
  try {
    const { title, description, releaseDate, categoryId, authorId, audioUrl, duration } = req.body;

    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    if (!description) return res.status(400).json({ success: false, message: 'Description is required' });
    if (!releaseDate) return res.status(400).json({ success: false, message: 'Release date is required' });
    if (!categoryId) return res.status(400).json({ success: false, message: 'Category ID is required' });
    if (!authorId) return res.status(400).json({ success: false, message: 'Author ID is required' });
    if (!audioUrl) return res.status(400).json({ success: false, message: 'Audio URL is required' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Cover image is required' });

    const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const author = await prisma.author.findUnique({ where: { id: parseInt(authorId) } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    // Upload cover image to BunnyCDN
    const coverName = `${randomUUID()}.${req.file.originalname.split('.').pop()}`;
    const coverImage = await uploadToBunny(req.file.buffer, coverName, 'audiobooks/covers');

    const audioBook = await prisma.audioBook.create({
      data: {
        title, description, audioUrl, duration,
        releaseDate: new Date(releaseDate),
        categoryId: parseInt(categoryId),
        authorId: parseInt(authorId),
        coverImage
      },
      ...audioBookInclude
    });

    res.status(201).json({ success: true, message: 'Audiobook created successfully', data: audioBook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create audiobook', error: error.message });
  }
};

// Update audiobook (Admin only)
export const updateAudioBook = async (req, res) => {
  try {
    const { title, description, releaseDate, category, author, audioUrl, duration } = req.body;

    const audioBook = await prisma.audioBook.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!audioBook) return res.status(404).json({ success: false, message: 'Audiobook not found' });

    const data = {};
    if (title) data.title = title;
    if (description) data.description = description;
    if (releaseDate) data.releaseDate = new Date(releaseDate);
    if (audioUrl) data.audioUrl = audioUrl;
    if (duration) data.duration = duration;

    if (req.file) {
      const coverName = `${randomUUID()}.${req.file.originalname.split('.').pop()}`;
      data.coverImage = await uploadToBunny(req.file.buffer, coverName, 'audiobooks/covers');
    }

    if (category) {
      if (!await prisma.category.findUnique({ where: { id: parseInt(category) } }))
        return res.status(404).json({ success: false, message: 'Category not found' });
      data.categoryId = parseInt(category);
    }

    if (author) {
      if (!await prisma.author.findUnique({ where: { id: parseInt(author) } }))
        return res.status(404).json({ success: false, message: 'Author not found' });
      data.authorId = parseInt(author);
    }

    const updated = await prisma.audioBook.update({ where: { id: parseInt(req.params.id) }, data, ...audioBookInclude });
    res.status(200).json({ success: true, message: 'Audiobook updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update audiobook', error: error.message });
  }
};

// Delete audiobook (Admin only)
export const deleteAudioBook = async (req, res) => {
  try {
    const audioBook = await prisma.audioBook.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!audioBook) return res.status(404).json({ success: false, message: 'Audiobook not found' });
    await prisma.audioBook.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: 'Audiobook deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete audiobook', error: error.message });
  }
};
