import express from 'express';
import { adminSignin, createAdmin, getAdminProfile, updateAdminProfile, uploadAdminAvatar, getAllAdmins, deleteAdmin, getAllUsers } from './admin.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/signin', upload.none(), adminSignin);
router.post('/create', protectAdmin, upload.none(), createAdmin);
router.get('/all', protectAdmin, getAllAdmins);
router.get('/users', protectAdmin, getAllUsers);
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, upload.none(), updateAdminProfile);
router.post('/upload-avatar', protectAdmin, upload.none(), uploadAdminAvatar);
router.delete('/:id', protectAdmin, deleteAdmin);

export default router;
