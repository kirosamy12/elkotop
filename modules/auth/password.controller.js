import User from '../user/user.model.js';
import { sendEmail } from '../../config/nodemailer.js';
import crypto from 'crypto';

const generateResetCode = () => Math.floor(10000 + Math.random() * 90000).toString();

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Please provide email address' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No user found with this email' });

    const resetCode = generateResetCode();
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.firstName},</p>
        <p>Use the code below to reset your password:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 0;">${resetCode}</h1>
        </div>
        <p><strong>This code will expire in 10 minutes.</strong></p>
      </div>
    `;

    const emailSent = await sendEmail(user.email, 'Password Reset Code', emailHtml);
    if (!emailSent) return res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });

    res.status(200).json({ success: true, message: 'Reset code sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request', error: error.message });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: 'Please provide email and reset code' });

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    const user = await User.findOne({ email, resetPasswordCode: hashedCode, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });

    res.status(200).json({ success: true, message: 'Code verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify code', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ success: false, message: 'Please provide email, code, and new password' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    const user = await User.findOne({ email, resetPasswordCode: hashedCode, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
};
