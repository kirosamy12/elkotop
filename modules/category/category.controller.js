import prisma from '../../config/db.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { title: 'asc' } });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { books: { include: { author: { select: { id: true, name: true, image: true } } } } }
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: { category: { id: category.id, title: category.title, createdAt: category.createdAt }, books: category.books } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Category title is required' });
    const exists = await prisma.category.findUnique({ where: { title } });
    if (exists) return res.status(400).json({ success: false, message: 'Category already exists' });
    const category = await prisma.category.create({ data: { title } });
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const updated = await prisma.category.update({ where: { id: parseInt(req.params.id) }, data: { title: req.body.title } });
    res.status(200).json({ success: true, message: 'Category updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const booksCount = await prisma.book.count({ where: { categoryId: parseInt(req.params.id) } });
    if (booksCount > 0) return res.status(400).json({ success: false, message: `Cannot delete category. It has ${booksCount} book(s)` });
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
  }
};
