import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');

    const exists = await prisma.admin.findUnique({ where: { email: 'admin@example.com' } });
    if (exists) {
      console.log('Admin already exists: admin@example.com');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: { firstName: 'Admin', lastName: 'User', email: 'admin@example.com', password: hashedPassword }
    });

    console.log('✅ Admin created!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
