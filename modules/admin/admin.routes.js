import express from 'express';
import { 
  adminSignin, 
  createAdmin, 
  getAdminProfile, 
  updateAdminProfile, 
  uploadAdminAvatar,
  getAllAdmins,
  deleteAdmin,
  getAllUsers
} from './admin.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// Admin signin (public)
router.post('/signin', adminSignin);

// Protected admin routes
router.post('/create', protectAdmin, createAdmin);
router.get('/all', protectAdmin, getAllAdmins);
router.get('/users', protectAdmin, getAllUsers);
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);
router.post('/upload-avatar', protectAdmin, upload.single('avatar'), uploadAdminAvatar);
router.delete('/:id', protectAdmin, deleteAdmin);

export default router;
