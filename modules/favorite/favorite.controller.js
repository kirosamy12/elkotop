import prisma from '../../config/db.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { book: { include: { category: { select: { id: true, title: true } }, author: { select: { id: true, name: true, image: true } } } } }
    });
    res.status(200).json({ success: true, count: favorites.length, data: favorites.map(f => f.book) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch favorites', error: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    const exists = await prisma.favorite.findUnique({ where: { userId_bookId: { userId: req.user.id, bookId } } });
    if (exists) return res.status(400).json({ success: false, message: 'Book already in favorites' });
    await prisma.favorite.create({ data: { userId: req.user.id, bookId } });
    res.status(201).json({ success: true, message: 'Book added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add favorite', error: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const exists = await prisma.favorite.findUnique({ where: { userId_bookId: { userId: req.user.id, bookId } } });
    if (!exists) return res.status(404).json({ success: false, message: 'Book not in favorites' });
    await prisma.favorite.delete({ where: { userId_bookId: { userId: req.user.id, bookId } } });
    res.status(200).json({ success: true, message: 'Book removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove favorite', error: error.message });
  }
};
