import React, { useState, useEffect } from "react";

/* =========================
   WELLNESS ACTIVITIES
========================= */
const WELLNESS_ACTIVITIES = [
  {
    id: 1,
    name: "Breathing Exercise",
    duration: "5 min",
    icon: "🌬️",
    description: "Calm your nervous system",
    color: "from-blue-400 to-cyan-400"
  },
  {
    id: 2,
    name: "Guided Meditation",
    duration: "10 min",
    icon: "🧘",
    description: "Relax your mind",
    color: "from-purple-400 to-pink-400"
  }
];

const ACTIVITY_GUIDES = {
  "Breathing Exercise": "Follow inhale → hold → exhale cycle slowly.",
  "Guided Meditation": "Close your eyes and focus on your breathing."
};

/* =========================
   MAIN DASHBOARD
========================= */
export default function MindSpaceDashboard({ user }) {
  const [userStats, setUserStats] = useState({
    moodTrend: 0,
    consistency: 0,
    improvement: 0,
    streak: 0,
    stress: 0,
    anxiety: 0,
    moodIndex: 0,
    history: []
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityGuide, setShowActivityGuide] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* ===== Load from localStorage ===== */
  useEffect(() => {
    const savedData = localStorage.getItem("mindData");
    if (savedData) {
      setUserStats(JSON.parse(savedData));
    }
    setIsLoading(false);
  }, []);

  /* ===== Dark Mode Toggle ===== */
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  /* ===== Update stats after assessment ===== */
  const updateAfterAssessment = (result) => {
    const { moodScore, stressScore, anxietyScore } = result;
    const today = new Date().toISOString().split("T")[0];

    // Update history
    const newEntry = {
      date: today,
      emotion: moodScore > 75 ? "Happy" : moodScore > 50 ? "Calm" : "Neutral",
      score: moodScore,
      duration: 15 // placeholder
    };

    const updatedHistory = [...userStats.history.filter(e => e.date !== today), newEntry];
    updatedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Compute trends
    const scores = updatedHistory.map(h => h.score);
    const moodTrend = scores.length > 1 ? ((scores[0] - scores[1]) / scores[1]) * 100 : 0;
    const consistency = updatedHistory.length;
    const improvement = scores.length > 1 ? ((scores[0] - scores[scores.length - 1]) / scores[scores.length - 1]) * 100 : 0;

    // Compute streak
    let streak = 0;
    if (updatedHistory.length) {
      streak = 1;
      let lastDate = new Date(updatedHistory[0].date);
      for (let i = 1; i < updatedHistory.length; i++) {
        const currentDate = new Date(updatedHistory[i].date);
        if ((lastDate - currentDate) / (1000 * 60 * 60 * 24) === 1) {
          streak++;
          lastDate = currentDate;
        } else break;
      }
    }

    const updatedStats = {
      moodTrend,
      consistency,
      improvement,
      streak,
      stress: stressScore,
      anxiety: anxietyScore,
      moodIndex: moodScore,
      history: updatedHistory
    };

    setUserStats(updatedStats);
    localStorage.setItem("mindData", JSON.stringify(updatedStats));
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  const displayName = user?.name || "User";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">MindSpace</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {displayName} 👋
          </p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
      </div>

      {/* ===== Top Stats ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Mood</p>
          <h2 className="text-xl font-bold">{userStats.moodTrend.toFixed(1)}%</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Consistency</p>
          <h2 className="text-xl font-bold">{userStats.consistency}/7</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Improvement</p>
          <h2 className="text-xl font-bold">{userStats.improvement.toFixed(1)}%</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Streak</p>
          <h2 className="text-xl font-bold">{userStats.streak} days</h2>
        </div>
      </div>

      {/* ===== Progress Cards ===== */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Stress Level", value: userStats.stress, icon: "🔥" },
          { label: "Anxiety Score", value: userStats.anxiety, icon: "🌪️" },
          { label: "Mood Index", value: userStats.moodIndex, icon: "🌞" }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
            <div className="flex justify-between">
              <span>{item.icon}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Weekly avg</span>
            </div>
            <h3 className="mt-2 font-semibold">{item.label}</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded mt-2">
              <div className="h-2 rounded bg-blue-500" style={{ width: `${item.value}%` }} />
            </div>
            <p className="mt-2 font-bold">{item.value}%</p>
          </div>
        ))}
      </div>

      {/* ===== Activities ===== */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Recommended Activities</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {WELLNESS_ACTIVITIES.map(activity => (
            <div
              key={activity.id}
              onClick={() => {
                setSelectedActivity(activity);
                setShowActivityGuide(false);
              }}
              className={`p-4 rounded-2xl shadow text-white cursor-pointer bg-gradient-to-r ${activity.color} hover:scale-105 transition`}
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl">{activity.icon}</span>
                <span className="font-semibold">{activity.name}</span>
                <span className="text-sm">{activity.duration}</span>
              </div>
              <p className="text-sm mt-2">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Emotion Timeline ===== */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Emotion Timeline</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          {userStats.history.length > 0 ? (
            userStats.history.map((item, i) => (
              <div key={i} className="flex justify-between border-b py-2 last:border-none">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span>{item.emotion}</span>
                <span className="font-semibold">{item.score}%</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No data yet. Complete an assessment to see your timeline.
            </p>
          )}
        </div>
      </div>

      {/* ===== Activity Modal ===== */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow w-80">
            <h3 className="text-xl font-bold mb-2">{selectedActivity.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{selectedActivity.description}</p>
            {!showActivityGuide ? (
              <button
                onClick={() => setShowActivityGuide(true)}
                className="bg-blue-500 text-white w-full py-2 rounded-lg"
              >
                Start
              </button>
            ) : (
              <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-center">
                {ACTIVITY_GUIDES[selectedActivity.name]}
              </p>
            )}
            <button
              onClick={() => setSelectedActivity(null)}
              className="mt-4 text-red-500 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}