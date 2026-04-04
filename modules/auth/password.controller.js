import User from '../user/user.model.js';
import { sendEmail } from '../../config/nodemailer.js';
import crypto from 'crypto';
import { Op } from 'sequelize';

const generateResetCode = () => Math.floor(10000 + Math.random() * 90000).toString();

// Request password reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email address' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with this email' });
    }

    const resetCode = generateResetCode();
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    await user.update({
      resetPasswordCode: hashedCode,
      resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000)
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${user.firstName},</p>
        <p>Use the code below to reset your password:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 0;">${resetCode}</h1>
        </div>
        <p><strong>This code will expire in 10 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    const emailSent = await sendEmail(user.email, 'Password Reset Code', emailHtml);
    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
    }

    res.status(200).json({ success: true, message: 'Reset code sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request', error: error.message });
  }
};

// Verify reset code
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Please provide email and reset code' });
    }

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    const user = await User.findOne({
      where: {
        email,
        resetPasswordCode: hashedCode,
        resetPasswordExpire: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
    }

    res.status(200).json({ success: true, message: 'Code verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify code', error: error.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, code, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    const user = await User.findOne({
      where: {
        email,
        resetPasswordCode: hashedCode,
        resetPasswordExpire: { [Op.gt]: new Date() }
      } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
    }

    await user.update({
      password: newPassword,
      resetPasswordCode: null,
      resetPasswordExpire: null
    }); 

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
}; 
