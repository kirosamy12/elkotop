import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../modules/admin/admin.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const exists = await Admin.findOne({ email: 'admin@example.com' });
    if (exists) {
      console.log('Admin already exists: admin@example.com');
      process.exit(0);
    }

    const admin = await Admin.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123'
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
