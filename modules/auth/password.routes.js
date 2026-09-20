import express from 'express';
import { forgotPassword, verifyResetCode, resetPassword } from './password.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/forgot-password', upload.any(), forgotPassword);
router.post('/verify-code', upload.any(), verifyResetCode);
router.post('/reset-password', upload.any(), resetPassword);

export default router;
