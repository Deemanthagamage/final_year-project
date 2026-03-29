import React, { useState, useEffect } from 'react';

const Assessment = ({ user, onNavigate }) => {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-3xl bg-gradient-to-br from-${result.color}-50 to-${result.color}-100 border-2 border-${result.color}-200 p-8 md:p-12`}>
            <div className="text-center mb-8">
              <div className={`w-24 h-24 bg-${result.color}-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <span className="text-5xl">
                  {result.percentage}%
                </span>
              </div>
              <h2 className={`text-4xl font-bold text-${result.color}-900 mb-2`}>
                {result.stressLevel}
              </h2>
              <p className={`text-lg text-${result.color}-800 mb-6`}>
                Score: {result.totalScore} / {result.maxScore}
              </p>
            </div>

            <div className={`bg-white/60 backdrop-blur rounded-2xl p-6 mb-8 border border-${result.color}-200`}>
              <h3 className={`text-lg font-semibold text-${result.color}-900 mb-3`}>
                Recommendation
              </h3>
              <p className={`text-${result.color}-800 leading-relaxed`}>
                {result.recommendation}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={resetAssessment}
                className={`w-full px-6 py-3 bg-${result.color}-600 hover:bg-${result.color}-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
              >
                Retake Assessment
              </button>
              <button
                onClick={goToDashboard}
                className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/40">
              <p className="text-xs text-slate-600 text-center">
                Assessment completed on {result.completedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessmentStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 p-8 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">📋</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Mental Health Assessment
              </h1>
              <p className="text-xl text-slate-700 mb-6 leading-relaxed">
                Take a quick self-assessment to understand your current stress levels and mental wellness. This 9-question assessment will help us provide personalized recommendations for your mental health journey.
              </p>

              <div className="bg-white/60 backdrop-blur rounded-2xl p-6 mb-8 border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">What to expect:</h3>
                <ul className="text-left space-y-2 text-slate-700">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-3 font-bold">✓</span>
                    9 simple questions about your stress levels
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-3 font-bold">✓</span>
                    Rate each on a scale from "Never" to "Very Often"
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-3 font-bold">✓</span>
                    Takes approximately 3-5 minutes
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-3 font-bold">✓</span>
                    Receive personalized insights and recommendations
                  </li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                  {error}
                </div>
              )}

              <button
                onClick={startAssessment}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {loading ? 'Starting...' : 'Start Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-slate-600">
              Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
            </h2>
            <span className="text-sm font-semibold text-slate-600">
              {Math.round(((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20 p-8 md:p-12 mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-relaxed">
            {ASSESSMENT_QUESTIONS[currentQuestionIndex]}
          </h3>

          {/* Response Options */}
          <div className="space-y-3">
            {SCALE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                disabled={loading}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-between font-semibold ${
                  answers[currentQuestionIndex]?.score === option.value
                    ? `${option.color} text-white border-transparent`
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-lg">{option.label}</span>
                <span className="text-2xl">{option.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Info */}
        <div className="text-center text-sm text-slate-600">
          Your answer will be saved automatically
        </div>
      </div>
    </div>
  );
};

export default Assessment;
