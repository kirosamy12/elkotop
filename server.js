import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import passwordRoutes from './modules/auth/password.routes.js';
import userRoutes from './modules/user/user.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import bookRoutes from './modules/book/book.routes.js';

dotenv.config();

const app = express();

// Connect to database
connectDB();  

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);
 
// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Books API',
    endpoints: {
      user: {
        signup: 'POST /api/auth/signup',
        signin: 'POST /api/auth/signin'
      },
      admin: {
        signin: 'POST /api/admin/signin',
        profile: 'GET /api/admin/profile'
      },
      categories: 'GET /api/categories',
      books: 'GET /api/books',
      search: 'GET /api/books/search?query=keyword',
      booksByAuthor: 'GET /api/books/author/:author'
    }
  });  
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
