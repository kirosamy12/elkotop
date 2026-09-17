import express from 'express';
import { getProfile, updateProfile, getAllUsers, deleteUser, uploadAvatar } from './user.controller.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, uploadAvatar);

// Admin only routes
router.get('/all', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
