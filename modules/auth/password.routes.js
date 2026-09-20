import express from 'express';
import { forgotPassword, verifyResetCode, resetPassword } from './password.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/forgot-password', upload.none(), forgotPassword);
router.post('/verify-code', upload.none(), verifyResetCode);
router.post('/reset-password', upload.none(), resetPassword);

export default router;
