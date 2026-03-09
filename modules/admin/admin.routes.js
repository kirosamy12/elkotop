import express from 'express';
import { adminSignin, getAdminProfile, updateAdminProfile, uploadAdminAvatar } from './admin.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// Admin signin
router.post('/signin', adminSignin);

// Protected admin routes
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);
router.post('/upload-avatar', protectAdmin, upload.single('avatar'), uploadAdminAvatar);

export default router;
