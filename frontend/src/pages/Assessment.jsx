import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Assuming you create this context

const Assessment = ({ user, onNavigate }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ASSESSMENT_QUESTIONS = [
    "How often have you been upset because of something that happened unexpectedly in the last month?",
    "How often have you felt that you were unable to control the important things in your life in the last month?",
    "How often have you felt nervous and stressed in the last month?",
    "How often have you felt confident about your ability to handle your personal problems in the last month?",
    "How often have you felt that things were going your way in the last month?",
    "How often have you found that you could not cope with all the things that you had to do in the last month?",
    "How often have you felt that you were on top of things in the last month?",
    "How often have you felt difficulties were piling up so high that you could not overcome them in the last month?",
    "How often have you felt that you were unable to control your anger in the last month?"
  ];

  const SCALE_OPTIONS = [
    { value: 0, label: 'Never', color: 'bg-green-500', icon: '😊' },
    { value: 1, label: 'Almost Never', color: 'bg-lime-500', icon: '🙂' },
    { value: 2, label: 'Sometimes', color: 'bg-yellow-500', icon: '😐' },
    { value: 3, label: 'Fairly Often', color: 'bg-orange-500', icon: '😟' },
    { value: 4, label: 'Very Often', color: 'bg-red-500', icon: '😢' }
  ];

  const startAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const newSessionId = 'assessment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      setSessionId(newSessionId);
      setAssessmentStarted(true);
      setCurrentQuestionIndex(0);
      setAnswers([]);
    } catch (err) {
      setError('Failed to start assessment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (score) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionIndex: currentQuestionIndex,
      question: ASSESSMENT_QUESTIONS[currentQuestionIndex],
      score: score,
      label: SCALE_OPTIONS.find(opt => opt.value === score)?.label
    };
    setAnswers(newAnswers);

    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment(newAnswers);
    }
  };

  const completeAssessment = async (finalAnswers) => {
    try {
      setLoading(true);
      const totalScore = finalAnswers.reduce((sum, ans) => sum + (ans?.score || 0), 0);
      const maxScore = ASSESSMENT_QUESTIONS.length * 4;
      const percentage = Math.round((totalScore / maxScore) * 100);

      let stressLevel = '';
      let recommendation = '';
      let color = '';

      if (percentage <= 25) {
        stressLevel = 'Low Stress';
        recommendation = 'Great job! You seem to be managing stress well. Keep up your healthy habits!';
        color = 'emerald';
      } else if (percentage <= 50) {
        stressLevel = 'Moderate Stress';
        recommendation = 'You are experiencing moderate stress. Consider trying relaxation techniques like meditation or exercise.';
        color = 'amber';
      } else if (percentage <= 75) {
        stressLevel = 'High Stress';
        recommendation = 'You are experiencing high stress. We recommend talking to a counselor or practicing mindfulness exercises.';
        color = 'orange';
      } else {
        stressLevel = 'Very High Stress';
        recommendation = 'You are experiencing very high stress. Please consider reaching out to a mental health professional for support.';
        color = 'red';
      }

      const assessmentResult = {
        sessionId,
        userId: user?.id,
        totalScore,
        maxScore,
        percentage,
        stressLevel,
        recommendation,
        color,
        answers: finalAnswers,
        completedAt: new Date().toLocaleString()
      };

      setResult(assessmentResult);
      setAssessmentCompleted(true);

      // Save to localStorage
      const previousAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      previousAssessments.push(assessmentResult);
      localStorage.setItem('assessments', JSON.stringify(previousAssessments));
    } catch (err) {
      setError('Failed to complete assessment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setSessionId(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAssessmentStarted(false);
    setAssessmentCompleted(false);
    setResult(null);
    setError(null);
  };

  const goToDashboard = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  if (assessmentCompleted && result) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className={`w-full max-w-2xl p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="text-center">
            <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Assessment Complete</h1>
            {result && (
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <h2 className={`text-2xl font-semibold text-${result.color}-500`}>{result.stressLevel}</h2>
                <p className={`mt-2 mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{result.recommendation}</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Score: {result.totalScore}/{result.maxScore}</p>
              </div>
            )}
            <button
              onClick={() => onNavigate('dashboard')}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!assessmentStarted) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className={`w-full max-w-2xl p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="text-center">
            <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mental Wellness Assessment</h1>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              This short assessment will help you understand your current stress levels.
            </p>
            <button
              onClick={startAssessment}
              className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Assessment'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-2xl p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
        {!assessmentStarted ? (
          <div className="text-center">
            <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mental Wellness Assessment</h1>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              This short assessment will help you understand your current stress levels.
            </p>
            <button
              onClick={startAssessment}
              className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Assessment'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        ) : !assessmentCompleted ? (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Question {currentQuestionIndex + 1}/{ASSESSMENT_QUESTIONS.length}</h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{ASSESSMENT_QUESTIONS[currentQuestionIndex]}</p>
            <div className="flex justify-around">
              {SCALE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`flex flex-col items-center p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  <span className={`text-3xl ${option.color}`}>{option.icon}</span>
                  <span className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Assessment Complete</h1>
            {result && (
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <h2 className={`text-2xl font-semibold text-${result.color}-500`}>{result.stressLevel}</h2>
                <p className={`mt-2 mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{result.recommendation}</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Score: {result.totalScore}/{result.maxScore}</p>
              </div>
            )}
            <button
              onClick={() => onNavigate('dashboard')}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
