import express from 'express';
import { getAllAds, getAdsBySlot, getAdById, createAd, updateAd, deleteAd } from './ad.controller.js';
import { protectAdmin } from '../../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/slot/:slot', getAdsBySlot);
router.get('/:id', getAdById);

// Admin only routes
router.get('/', protectAdmin, getAllAds);
router.post('/', protectAdmin, upload.single('image'), createAd);
router.put('/:id', protectAdmin, upload.single('image'), updateAd);
router.delete('/:id', protectAdmin, deleteAd);

export default router;
