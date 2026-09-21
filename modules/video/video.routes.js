import express from 'express';
import { getAllVideos, getVideoById, getVideosByAuthor, searchVideos, createVideo, updateVideo, deleteVideo } from './video.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', getAllVideos);
router.get('/search', searchVideos);
router.get('/author/:authorId', getVideosByAuthor);
router.get('/:id', getVideoById);

// Admin only routes
router.post('/', protectAdmin, upload.single('coverImage'), createVideo);
router.put('/:id', protectAdmin, upload.single('coverImage'), updateVideo);
router.delete('/:id', protectAdmin, deleteVideo);

export default router;
