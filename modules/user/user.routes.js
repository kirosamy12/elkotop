import express from 'express';
import { getProfile, updateProfile, getAllUsers, deleteUser, uploadAvatar } from './user.controller.js';
import { protect, authorize } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.any(), updateProfile);
router.put('/avatar', protect, upload.any(), uploadAvatar);

// Admin only routes
router.get('/all', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
