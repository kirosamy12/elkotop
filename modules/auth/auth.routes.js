import express from 'express';
import { signup, signin } from './auth.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/signup', upload.any(), signup);
router.post('/signin', upload.any(), signin);

export default router;