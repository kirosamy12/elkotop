import prisma from '../../config/db.js';
import { uploadToBunny } from '../../config/bunny.js';
import { randomUUID } from 'crypto';

// Get all ads (Admin)
export const getAllAds = async (req, res) => {
  try {
    const ads = await prisma.ad.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, count: ads.length, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch ads', error: error.message });
  }
};

// Get active ads by slot (Public)
export const getAdsBySlot = async (req, res) => {
  try {
    const { slot } = req.params;
    const now = new Date();

    const ads = await prisma.ad.findMany({
      where: {
        slot,
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } }
        ]
      }
    });

    res.status(200).json({ success: true, count: ads.length, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch ads', error: error.message });
  }
};

// Get ad by ID
export const getAdById = async (req, res) => {
  try {
    const ad = await prisma.ad.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    res.status(200).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch ad', error: error.message });
  }
};

// Create ad (Admin only)
export const createAd = async (req, res) => {
  try {
    const { title, link, slot, isActive, startDate, endDate } = req.body;

    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    if (!slot) return res.status(400).json({ success: false, message: 'Slot is required' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Ad image is required' });

    const validSlots = ['HOME_BANNER', 'HOME_MIDDLE', 'BOOKS_TOP', 'BOOKS_BOTTOM', 'AUDIOBOOKS_TOP', 'VIDEOS_TOP', 'SIDEBAR', 'POPUP'];
    if (!validSlots.includes(slot)) {
      return res.status(400).json({ success: false, message: `Invalid slot. Valid slots: ${validSlots.join(', ')}` });
    }

    const imageName = `${randomUUID()}.${req.file.originalname.split('.').pop()}`;
    const image = await uploadToBunny(req.file.buffer, imageName, 'ads');

    const ad = await prisma.ad.create({
      data: {
        title,
        image,
        link: link || null,
        slot,
        isActive: isActive === 'false' ? false : true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.status(201).json({ success: true, message: 'Ad created successfully', data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create ad', error: error.message });
  }
};

// Update ad (Admin only)
export const updateAd = async (req, res) => {
  try {
    const { title, link, slot, isActive, startDate, endDate } = req.body;

    const ad = await prisma.ad.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

    const data = {};
    if (title) data.title = title;
    if (link !== undefined) data.link = link || null;
    if (slot) data.slot = slot;
    if (isActive !== undefined) data.isActive = isActive === 'false' ? false : true;
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;

    if (req.file) {
      const imageName = `${randomUUID()}.${req.file.originalname.split('.').pop()}`;
      data.image = await uploadToBunny(req.file.buffer, imageName, 'ads');
    }

    const updated = await prisma.ad.update({ where: { id: parseInt(req.params.id) }, data });
    res.status(200).json({ success: true, message: 'Ad updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update ad', error: error.message });
  }
};

// Delete ad (Admin only)
export const deleteAd = async (req, res) => {
  try {
    const ad = await prisma.ad.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    await prisma.ad.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete ad', error: error.message });
  }
};
