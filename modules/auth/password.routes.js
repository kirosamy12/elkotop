import express from 'express';
import { forgotPassword, verifyResetCode, resetPassword } from './password.controller.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;
