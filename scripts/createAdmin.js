import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Admin from '../modules/admin/admin.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ where: { email: 'admin@example.com' } });
    if (existingAdmin) {
      console.log('Admin already exists with email: admin@example.com');
      process.exit(0);
    }

    const admin = await Admin.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('✅ Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('\nYou can now sign in at: POST /api/admin/signin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
