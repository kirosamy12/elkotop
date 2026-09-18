import prisma from '../../config/db.js';

export const getFavoriteAuthors = async (req, res) => {
  try {
    const favorites = await prisma.favoriteAuthor.findMany({
      where: { userId: req.user.id },
      include: { author: true }
    });
    res.status(200).json({ success: true, count: favorites.length, data: favorites.map(f => f.author) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch favorite authors', error: error.message });
  }
};

export const addFavoriteAuthor = async (req, res) => {
  try {
    const authorId = parseInt(req.params.authorId);
    const author = await prisma.author.findUnique({ where: { id: authorId } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });
    const exists = await prisma.favoriteAuthor.findUnique({ where: { userId_authorId: { userId: req.user.id, authorId } } });
    if (exists) return res.status(400).json({ success: false, message: 'Author already in favorites' });
    await prisma.favoriteAuthor.create({ data: { userId: req.user.id, authorId } });
    res.status(201).json({ success: true, message: 'Author added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add favorite author', error: error.message });
  }
};

export const removeFavoriteAuthor = async (req, res) => {
  try {
    const authorId = parseInt(req.params.authorId);
    const exists = await prisma.favoriteAuthor.findUnique({ where: { userId_authorId: { userId: req.user.id, authorId } } });
    if (!exists) return res.status(404).json({ success: false, message: 'Author not in favorites' });
    await prisma.favoriteAuthor.delete({ where: { userId_authorId: { userId: req.user.id, authorId } } });
    res.status(200).json({ success: true, message: 'Author removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove favorite author', error: error.message });
  }
};
