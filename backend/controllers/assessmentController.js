import Assessment from '../models/Assessment.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Pre-defined mental health assessment questions
const ASSESSMENT_QUESTIONS = [
  "How often have you been upset because of something that happened unexpectedly in the last month?",
  "how often have you felt that you were unable to control the importtant things in your life in the last month?",
  "how often have you felt nervous and stressed in the last month?",
  "how often have you felt confident about your ability to handle your personal problems in the last month?",
  "how often have you felt that things were going your way in the last month?",
  "how often have you found that you could not cope with all the things that you had to do in the last month?",
  "how often have you found that you could not cope with  all thee things that you had to do in the last month?",
  "how often have you felt that you were on top of things in the last month?",
  "how often have you felt difficulties were pilling up so high that you could not overcome them in the last month?",
  "how often have you felt that were you were unable to control your anger in the last month?"
];

// Start new assessment
export const startAssessment = async (req, res) => {
  try {
    const sessionId = 'assessment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const newAssessment = new Assessment({
      sessionId,
      userId: req.body.userId || null,
      currentQuestionIndex: 0,
      questionsAnswers: []
    });

    await newAssessment.save();

    res.status(200).json({
      message: "Assessment started successfully",
      sessionId,
      currentQuestion: {
        index: 0,
        question: ASSESSMENT_QUESTIONS[0],
        totalQuestions: ASSESSMENT_QUESTIONS.length
      }
    });

  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({
      error: "Failed to start assessment",
      details: error.message
    });
  }
};

// Submit answer and get next question
export const submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({ error: "Session ID and answer are required" });
    }

    const assessment = await Assessment.findOne({ sessionId });
    if (!assessment) {
      return res.status(404).json({ error: "Assessment session not found" });
    }

    if (assessment.isCompleted) {
      return res.status(400).json({ error: "Assessment is already completed" });
    }

    // Get current question
    const currentQuestionIndex = assessment.currentQuestionIndex;
    const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];

    // Analyze the answer with AI
    let aiAnalysis = '';
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const analysisPrompt = `Analyze this mental health assessment answer in 1-2 sentences. Focus on emotional indicators and mental state:
Question: "${currentQuestion}"
Answer: "${answer}"
Provide brief analysis of mental health indicators:`;

      const result = await model.generateContent(analysisPrompt);
      aiAnalysis = result.response.text().trim();
    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      aiAnalysis = 'Analysis temporarily unavailable';
    }

    // Save the question-answer pair
    assessment.questionsAnswers.push({
      question: currentQuestion,
      answer: answer.trim(),
      aiAnalysis
    });

    // Move to next question
    assessment.currentQuestionIndex += 1;

    // Check if assessment is complete
    if (assessment.currentQuestionIndex >= ASSESSMENT_QUESTIONS.length) {
      assessment.isCompleted = true;
      assessment.completedAt = new Date();

      // Generate final analysis and mental health level
      const finalAnalysisResult = await generateFinalAnalysis(assessment.questionsAnswers);
      assessment.finalAnalysis = finalAnalysisResult.analysis;
      assessment.mentalHealthLevel = finalAnalysisResult.level;
      assessment.score = finalAnalysisResult.score;

      await assessment.save();

      return res.status(200).json({
        message: "Assessment completed",
        isCompleted: true,
        results: {
          mentalHealthLevel: assessment.mentalHealthLevel,
          score: assessment.score,
          finalAnalysis: assessment.finalAnalysis,
          totalQuestions: ASSESSMENT_QUESTIONS.length
        }
      });
    }

    // Save progress and return next question
    await assessment.save();

    res.status(200).json({
      message: "Answer submitted successfully",
      isCompleted: false,
      currentQuestion: {
        index: assessment.currentQuestionIndex,
        question: ASSESSMENT_QUESTIONS[assessment.currentQuestionIndex],
        totalQuestions: ASSESSMENT_QUESTIONS.length
      }
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      error: "Failed to submit answer",
      details: error.message
    });
  }
};

// Generate final analysis using AI
const generateFinalAnalysis = async (questionsAnswers) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare the data for analysis
    const qaText = questionsAnswers.map((qa, index) => 
      `${index + 1}. ${qa.question}\nAnswer: ${qa.answer}\nAnalysis: ${qa.aiAnalysis}\n`
    ).join('\n');

    const finalPrompt = `Based on this mental health assessment, provide:
1. A comprehensive analysis (3-4 sentences)
2. A mental health level (Excellent/Good/Fair/Poor/Critical)
3. A numeric score (0-100)

Assessment Data:
${qaText}

Respond in this exact format:
ANALYSIS: [your analysis]
LEVEL: [Excellent/Good/Fair/Poor/Critical]
SCORE: [0-100]`;

    const result = await model.generateContent(finalPrompt);
    const response = result.response.text().trim();

    // Parse the response
    const analysisMatch = response.match(/ANALYSIS:\s*(.+?)(?=\nLEVEL:|$)/s);
    const levelMatch = response.match(/LEVEL:\s*([A-Za-z]+)/);
    const scoreMatch = response.match(/SCORE:\s*(\d+)/);

    return {
      analysis: analysisMatch ? analysisMatch[1].trim() : 'Analysis could not be generated.',
      level: levelMatch ? levelMatch[1] : 'Fair',
      score: scoreMatch ? parseInt(scoreMatch[1]) : 50
    };

  } catch (error) {
    console.error('Final analysis error:', error);
    return {
      analysis: 'Your responses have been recorded. Please consider speaking with a mental health professional for personalized guidance.',
      level: 'Fair',
      score: 50
    };
  }
};

// Get assessment results
export const getResults = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const assessment = await Assessment.findOne({ sessionId });
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    if (!assessment.isCompleted) {
      return res.status(400).json({ error: "Assessment is not yet completed" });
    }

    res.status(200).json({
      sessionId: assessment.sessionId,
      mentalHealthLevel: assessment.mentalHealthLevel,
      score: assessment.score,
      finalAnalysis: assessment.finalAnalysis,
      questionsAnswers: assessment.questionsAnswers,
      completedAt: assessment.completedAt
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      error: "Failed to get results",
      details: error.message
    });
  }
};