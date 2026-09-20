import prisma from '../../config/db.js';

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.status(200).json({
      success: true,
      data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar, role: user.role, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await prisma.user.update({ where: { id: req.user.id }, data: { firstName, lastName } });
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
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

export const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ success: false, message: 'Please provide avatar URL' });
    const user = await prisma.user.update({ where: { id: req.user.id }, data: { avatar } });
    res.status(200).json({ success: true, message: 'Avatar updated successfully', data: { avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update avatar', error: error.message });
  }
};
