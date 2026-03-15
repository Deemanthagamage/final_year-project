import React, { useState, useEffect } from 'react';

export default function MoodCheck() {
  const [assessmentState, setAssessmentState] = useState('idle'); // idle, active, completed
  const [sessionId, setSessionId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Start new assessment
  const startAssessment = async () => {
    setLoading(true);
    try {
      console.log('Starting assessment...');
      const response = await fetch('http://localhost:4000/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await response.json();
      console.log('Assessment started:', data);

      if (response.ok) {
        setSessionId(data.sessionId);
        setCurrentQuestion(data.currentQuestion);
        setAssessmentState('active');
      } else {
        console.error('Failed to start assessment:', data);
        alert('Failed to start assessment: ' + data.error);
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      alert('Error starting assessment');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer and get next question
  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer before continuing.');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting answer:', { sessionId, answer });
      const response = await fetch('http://localhost:4000/api/assessment/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answer })
      });

      const data = await response.json();
      console.log('Answer submitted:', data);

      if (response.ok) {
        if (data.isCompleted) {
          setResults(data.results);
          setAssessmentState('completed');
        } else {
          setCurrentQuestion(data.currentQuestion);
        }
        setAnswer(''); // Clear the answer field
      } else {
        console.error('Failed to submit answer:', data);
        alert('Failed to submit answer: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error submitting answer');
    } finally {
      setLoading(false);
    }
  };

  // Reset assessment
  const resetAssessment = () => {
    setAssessmentState('idle');
    setSessionId('');
    setCurrentQuestion({});
    setAnswer('');
    setResults(null);
  };

  const openEmergencyDoctors = () => {
    window.open(
      'https://www.google.com/search?q=mental+health+emergency+doctors+near+me',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const openMentalHealthActivities = () => {
    window.open(
      'https://www.google.com/search?q=mental+health+activities+for+stress+relief',
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (assessmentState === 'active') {
        submitAnswer();
      }
    }
  };

  const getScoreNotification = (score) => {
    if (score <= 20) {
      return {
        title: 'Immediate Support Recommended',
        message: 'Your score is between 0-20%. Please meet a doctor as soon as possible for professional support.',
        style: 'bg-red-50 border-red-200 text-red-800'
      };
    }

    if (score <= 50) {
      return {
        title: 'Professional Help + Activities Recommended',
        message: 'Your score is between 20-50%. Please consult a doctor and start regular mental health activities.',
        style: 'bg-amber-50 border-amber-200 text-amber-800'
      };
    }

    return {
      title: 'Activity-Based Improvement Recommended',
      message: 'Your score is between 50-100%. Continue with mental health activities to maintain and improve wellbeing.',
      style: 'bg-emerald-50 border-emerald-200 text-emerald-800'
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Mental Health Assessment</h2>
      
      {assessmentState === 'idle' && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Ready for your mental health check?</h3>
            <p className="text-gray-600 mb-4">
              This assessment consists of 10 questions designed to understand your current mental health state.
              Each answer will be analyzed by AI to provide you with personalized insights.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              ⏱️ Takes about 5-10 minutes • 🔒 Your responses are confidential
            </p>
          </div>
          <button
            onClick={startAssessment}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Begin Assessment'}
          </button>
        </div>
      )}

      {assessmentState === 'active' && currentQuestion.question && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestion.index + 1} of {currentQuestion.totalQuestions}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentQuestion.index + 1) / currentQuestion.totalQuestions) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here..."
              disabled={loading}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
              rows="4"
            />
            <div className="flex justify-between">
              <button
                onClick={resetAssessment}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel Assessment
              </button>
              <button
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {assessmentState === 'completed' && results && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          {(() => {
            const scoreNotice = getScoreNotification(Number(results.score) || 0);
            return (
              <div className={`mb-6 border rounded-lg p-4 ${scoreNotice.style}`}>
                <div className="font-semibold mb-1">{scoreNotice.title}</div>
                <p className="text-sm leading-relaxed">{scoreNotice.message}</p>
              </div>
            );
          })()}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Assessment Complete!</h3>
            <div className="inline-flex items-center space-x-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${
                  results.mentalHealthLevel === 'Excellent' ? 'text-green-600' :
                  results.mentalHealthLevel === 'Good' ? 'text-blue-600' :
                  results.mentalHealthLevel === 'Fair' ? 'text-yellow-600' :
                  results.mentalHealthLevel === 'Poor' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {results.score}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-semibold ${
                  results.mentalHealthLevel === 'Excellent' ? 'text-green-600' :
                  results.mentalHealthLevel === 'Good' ? 'text-blue-600' :
                  results.mentalHealthLevel === 'Fair' ? 'text-yellow-600' :
                  results.mentalHealthLevel === 'Poor' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {results.mentalHealthLevel}
                </div>
                <div className="text-sm text-gray-600">Mental Health Level</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Analysis & Recommendations</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{results.finalAnalysis}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <button
              onClick={resetAssessment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors md:justify-self-start"
            >
              Take Another Assistmence
            </button>
            <button
              onClick={openEmergencyDoctors}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors md:justify-self-center"
            >
              Emerce Doctors
            </button>
            <button
              onClick={openMentalHealthActivities}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors md:justify-self-end"
            >
              Mental Health Activities
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Remember:</strong> This assessment is for informational purposes only. 
              If you're experiencing persistent mental health concerns, please consider speaking 
              with a mental health professional.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
