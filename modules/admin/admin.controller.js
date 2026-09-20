import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken.js';

export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(admin.id);
    res.status(200).json({
      success: true,
      message: 'Admin signed in successfully',
      data: { admin: { id: admin.id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, avatar: admin.avatar, role: 'admin' }, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sign in failed', error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required' });

    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: 'Admin with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({ data: { firstName, lastName, email, password: hashedPassword } });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: { id: admin.id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, avatar: admin.avatar, role: 'admin', createdAt: admin.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create admin', error: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.status(200).json({
      success: true,
      data: { id: admin.id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, avatar: admin.avatar, role: 'admin', createdAt: admin.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const admin = await prisma.admin.update({ where: { id: req.user.id }, data: { firstName, lastName } });
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: admin.id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, avatar: admin.avatar, role: 'admin' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

export const uploadAdminAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ success: false, message: 'Please provide avatar URL' });
    const admin = await prisma.admin.update({ where: { id: req.user.id }, data: { avatar } });
    res.status(200).json({ success: true, message: 'Avatar updated successfully', data: { avatar: admin.avatar } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update avatar', error: error.message });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, avatar: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, count: admins.length, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admins', error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    if (admin.id === req.user.id) return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    await prisma.admin.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete admin', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};
