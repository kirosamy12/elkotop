import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized to access this route' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true }
    });
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (error) {
    console.error('protect error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid token', error: error.message });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role '${req.user.role}' is not authorized` });
    }
    next();
  };
};

export const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized to access this route' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, firstName: true, lastName: true, email: true, avatar: true }
    });
    if (!admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    req.user = { ...admin, role: 'admin' };
    next();
  } catch (error) {
    console.error('protectAdmin error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid token', error: error.message });
  }
};
