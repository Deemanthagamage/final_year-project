import express from 'express';
import { startAssessment, submitAnswer, getResults } from '../controllers/assessmentController.js';

const router = express.Router();

// Start a new mental health assessment
router.post('/start', startAssessment);

// Submit answer and get next question
router.post('/answer', submitAnswer);

// Get final results
router.get('/results/:sessionId', getResults);

export default router;