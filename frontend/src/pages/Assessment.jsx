import React, { useState, useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeContext";

const Assessment = ({ user, onNavigate }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const QUESTIONS = [
    "How often have you been upset because of something unexpected?",
    "How often did you feel unable to control important things?",
    "How often have you felt nervous and stressed?",
    "How often have you felt confident handling problems?",
    "How often did things go your way?",
    "How often could you not cope with tasks?",
    "How often did you feel on top of things?",
    "How often did difficulties pile up too high?",
    "How often could you not control your anger?"
  ];

  const OPTIONS = [
    { value: 0, label: "Never", emoji: "😊" },
    { value: 1, label: "Rarely", emoji: "🙂" },
    { value: 2, label: "Sometimes", emoji: "😐" },
    { value: 3, label: "Often", emoji: "😟" },
    { value: 4, label: "Very Often", emoji: "😢" }
  ];

  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (score) => {
    const updated = [...answers];
    updated[currentQuestionIndex] = score;
    setAnswers(updated);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment(updated);
    }
  };

  const completeAssessment = (finalAnswers) => {
    setLoading(true);

    const total = finalAnswers.reduce((a, b) => a + b, 0);
    const max = QUESTIONS.length * 4;
    const percentage = Math.round((total / max) * 100);

    // 🔥 Convert to dashboard format
    const dashboardData = {
      moodScore: 100 - percentage,
      stressScore: percentage,
      anxietyScore: Math.round(percentage * 0.8)
    };

    // ✅ Save for dashboard
    localStorage.setItem("assessmentResult", JSON.stringify(dashboardData));

    // ✅ Save history
    const history = JSON.parse(localStorage.getItem("assessments") || "[]");
    history.push({
      date: new Date().toISOString(),
      percentage
    });
    localStorage.setItem("assessments", JSON.stringify(history));

    // 🚀 Navigate to dashboard
    setTimeout(() => {
      if (onNavigate) {
        onNavigate("dashboard", dashboardData);
      }
    }, 1000);
  };

  /* ================= UI ================= */

  // ===== START SCREEN =====
  if (!assessmentStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 p-10 rounded-3xl shadow-2xl text-center max-w-md w-full">
          
          <h1 className="text-4xl font-bold text-white mb-4">
            MindSpace 🧠
          </h1>

          <p className="text-white/80 mb-6">
            Discover your stress level and improve your mental wellness
          </p>

          <button
            onClick={startAssessment}
            className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-purple-100 transition"
          >
            Start Assessment →
          </button>
        </div>
      </div>
    );
  }

  // ===== QUESTIONS UI =====
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      <div className="w-full max-w-2xl p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-white">
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>{QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-semibold mb-6 text-center leading-relaxed">
          {QUESTIONS[currentQuestionIndex]}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className="flex flex-col items-center p-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition transform hover:scale-110 shadow-lg"
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span className="mt-2 text-sm">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2 text-white/80">
              Analyzing your results...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;