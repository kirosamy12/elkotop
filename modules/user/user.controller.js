import User from './user.model.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar, role: user.role, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};  

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { firstName, lastName }, { new: true });
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ success: false, message: 'Please provide avatar URL' });

    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    res.status(200).json({ success: true, message: 'Avatar updated successfully', data: { avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update avatar', error: error.message });
  }
};
