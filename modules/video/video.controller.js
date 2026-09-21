import prisma from '../../config/db.js';
import { uploadToBunny } from '../../config/bunny.js';
import { randomUUID } from 'crypto';

const videoInclude = {
  include: {
    category: { select: { id: true, title: true } },
    author: { select: { id: true, name: true, image: true } }
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({ ...videoInclude, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch videos', error: error.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: parseInt(req.params.id) }, ...videoInclude });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch video', error: error.message });
  }
};

export const getVideosByAuthor = async (req, res) => {
  try {
    const author = await prisma.author.findUnique({ where: { id: parseInt(req.params.authorId) } });
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });
    const videos = await prisma.video.findMany({ where: { authorId: parseInt(req.params.authorId) }, ...videoInclude });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch videos by author', error: error.message });
  }
};

export const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });
    const videos = await prisma.video.findMany({
      where: { title: { contains: query, mode: 'insensitive' } },
      ...videoInclude
    });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search videos', error: error.message });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, description, releaseDate, categoryId, authorId, videoUrl, duration } = req.body;

    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    if (!description) return res.status(400).json({ success: false, message: 'Description is required' });
    if (!releaseDate) return res.status(400).json({ success: false, message: 'Release date is required' });
    if (!categoryId) return res.status(400).json({ success: false, message: 'Category ID is required' });
    if (!authorId) return res.status(400).json({ success: false, message: 'Author ID is required' });
    if (!videoUrl) return res.status(400).json({ success: false, message: 'Video URL is required' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Cover image is required' });

    if (!await prisma.category.findUnique({ where: { id: parseInt(categoryId) } }))
      return res.status(404).json({ success: false, message: 'Category not found' });

    if (!await prisma.author.findUnique({ where: { id: parseInt(authorId) } }))
      return res.status(404).json({ success: false, message: 'Author not found' });

    const coverName = `${randomUUID()}.${req.file.originalname.split('.').pop()}`;
    const coverImage = await uploadToBunny(req.file.buffer, coverName, 'videos/covers');

    const video = await prisma.video.create({
      data: {
        title, description, videoUrl, duration,
        releaseDate: new Date(releaseDate),
        categoryId: parseInt(categoryId),
        authorId: parseInt(authorId),
        coverImage
      },
      ...videoInclude
    });

    res.status(201).json({ success: true, message: 'Video created successfully', data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create video', error: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { title, description, releaseDate, category, author, videoUrl, duration } = req.body;

    const video = await prisma.video.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    const data = {};
    if (title) data.title = title;
    if (description) data.description = description;
    if (releaseDate) data.releaseDate = new Date(releaseDate);
    if (videoUrl) data.videoUrl = videoUrl;
    if (duration) data.duration = duration;

    if (req.file) {
      const coverName = `${randomUUID()}.${req.file.originalname.split('.').pop()}`;
      data.coverImage = await uploadToBunny(req.file.buffer, coverName, 'videos/covers');
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

    const updated = await prisma.video.update({ where: { id: parseInt(req.params.id) }, data, ...videoInclude });
    res.status(200).json({ success: true, message: 'Video updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update video', error: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    await prisma.video.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete video', error: error.message });
  }
};
