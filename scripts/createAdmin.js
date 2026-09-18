import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');

    const exists = await prisma.admin.findUnique({ where: { email: 'me@abanob.co' } });
    if (exists) {
      console.log('Admin already exists: me@abanob.co');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Ragaa@2026V2', 10);
    const admin = await prisma.admin.create({
      data: { firstName: 'Admin', lastName: 'User', email: 'me@abanob.co', password: hashedPassword }
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
