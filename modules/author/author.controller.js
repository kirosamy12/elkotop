import prisma from '../../config/db.js';

export const getAllAuthors = async (req, res) => {
  try {
    const authors = await prisma.author.findMany({ orderBy: { name: 'asc' } });
    res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch authors', error: error.message });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await prisma.author.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });
    const books = await prisma.book.findMany({ where: { authorId: parseInt(req.params.id) }, include: { category: { select: { id: true, title: true } } } });
    res.status(200).json({ success: true, data: { ...author, books } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch author', error: error.message });
  }
};

export const createAuthor = async (req, res) => {
  try {
    const { name, bio, image } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Author name is required' });
    const author = await prisma.author.create({ data: { name, bio, image: image || '' } });
    res.status(201).json({ success: true, message: 'Author created successfully', data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create author', error: error.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const { name, bio, image } = req.body;
    const author = await prisma.author.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });
    const updated = await prisma.author.update({ where: { id: parseInt(req.params.id) }, data: { ...(name && { name }), ...(bio && { bio }), ...(image && { image }) } });
    res.status(200).json({ success: true, message: 'Author updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update author', error: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const author = await prisma.author.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });
    const booksCount = await prisma.book.count({ where: { authorId: parseInt(req.params.id) } });
    if (booksCount > 0) return res.status(400).json({ success: false, message: `Cannot delete author. They have ${booksCount} book(s)` });
    await prisma.author.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete author', error: error.message });
  }
};
