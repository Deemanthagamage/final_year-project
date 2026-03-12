import mongoose from 'mongoose';

const questionAnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  aiAnalysis: {
    type: String,
    default: ''
  }
});

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false  // For now, we'll make it optional
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  questionsAnswers: [questionAnswerSchema],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  finalAnalysis: {
    type: String,
    default: ''
  },
  mentalHealthLevel: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'],
    default: null
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

export default mongoose.model('Assessment', assessmentSchema);