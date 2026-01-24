import express from 'express';
import {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentById,
} from '../controllers/authController.js';

const router = express.Router();

// Auth routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Student routes
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);

export default router;
