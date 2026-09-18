import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken.js';

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ success: false, message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword }
    });

    const token = generateToken(user.id);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar, role: user.role }, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      data: { user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar, role: user.role }, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sign in failed', error: error.message });
  }
};
