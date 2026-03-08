import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import passwordRoutes from './modules/auth/password.routes.js';
import userRoutes from './modules/user/user.routes.js';

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
 
// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Authentication API',
    
  });  
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
