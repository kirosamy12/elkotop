import Admin from './admin.model.js';
import generateToken from '../../utils/generateToken.js';

// Admin Sign In
export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ where: { email } });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(admin.id);

    res.status(200).json({
      success: true,
      message: 'Admin signed in successfully',
      data: {
        admin: { id: admin.id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, avatar: admin.avatar, role: 'admin' },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sign in failed', error: error.message });
  }
};

// Create New Admin
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const adminExists = await Admin.findOne({ where: { email } });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
    }

    const admin = await Admin.create({ firstName, lastName, email, password });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: { id: admin.id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, avatar: admin.avatar, role: 'admin', createdAt: admin.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create admin', error: error.message });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({
      success: true,
      data: { id: admin.id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, avatar: admin.avatar, role: 'admin', createdAt: admin.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const admin = await Admin.findByPk(req.user.id);
    await admin.update({ firstName, lastName });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: admin.id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, avatar: admin.avatar, role: 'admin' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

// Upload Admin Avatar
export const uploadAdminAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const cloudinary = (await import('../../config/cloudinary.js')).default;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'admins/avatars', transformation: [{ width: 500, height: 500, crop: 'fill' }, { quality: 'auto' }] },
        (error, result) => { if (error) reject(error); else resolve(result); }
      );
      uploadStream.end(req.file.buffer);
    });

    const admin = await Admin.findByPk(req.user.id);
    await admin.update({ avatar: result.secure_url });

    res.status(200).json({ success: true, message: 'Avatar uploaded successfully', data: { avatar: result.secure_url } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload avatar', error: error.message });
  }
};

// Get All Admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password', 'resetPasswordCode', 'resetPasswordExpire'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, count: admins.length, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admins', error: error.message });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (admin.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    await admin.destroy();
    res.status(200).json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete admin', error: error.message });
  }
};
