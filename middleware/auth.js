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
    req.user = await prisma.user.findUnique({ where: { id: decoded.id }, omit: { password: true } });
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
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
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id }, omit: { password: true } });
    if (!admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    req.user = { ...admin, role: 'admin' };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
