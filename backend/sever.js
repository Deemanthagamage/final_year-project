import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mental-health-app';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mental Health App API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// User routes (for frontend signup/login compatibility)
app.post('/api/signup', async (req, res) => {
  const { signupUser } = await import('./controllers/userController.js');
  signupUser(req, res);
});

app.post('/api/login', async (req, res) => {
  const { loginUser } = await import('./controllers/userController.js');
  loginUser(req, res);
});

// Chatbot routes
app.use('/api/chatbot', chatbotRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});