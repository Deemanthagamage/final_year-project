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

  /* ===== Load user + stats ===== */
  useEffect(() => {
    const savedData = localStorage.getItem("mindData");
    if (savedData) setUserStats(JSON.parse(savedData));

    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(JSON.parse(savedMode));

    setIsLoading(false);
  }, []);

  /* ===== Listen for assessment result ===== */
  useEffect(() => {
    const result = JSON.parse(localStorage.getItem("assessmentResult"));
    if (result) {
      updateAfterAssessment(result);
      localStorage.removeItem("assessmentResult");
    }
  }, []);

  /* ===== Sync across tabs ===== */
  useEffect(() => {
    const handleStorageChange = () => {
      const savedData = localStorage.getItem("mindData");
      if (savedData) setUserStats(JSON.parse(savedData));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* ===== Dark mode ===== */
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  /* ===== Update stats ===== */
  const updateAfterAssessment = (result) => {
    const { moodScore, stressScore, anxietyScore } = result;
    const today = new Date().toISOString().split("T")[0];

    const newEntry = {
      date: today,
      emotion:
        moodScore > 75 ? "Happy" : moodScore > 50 ? "Calm" : "Neutral",
      score: moodScore,
      duration: 15
    };

    const updatedHistory = [
      ...userStats.history.filter((e) => e.date !== today),
      newEntry
    ];

    updatedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    const scores = updatedHistory.map((h) => h.score);

    const moodTrend =
      scores.length > 1 && scores[1] !== 0
        ? ((scores[0] - scores[1]) / scores[1]) * 100
        : 0;

    const consistency = updatedHistory.length;

    const improvement =
      scores.length > 1 && scores[scores.length - 1] !== 0
        ? ((scores[0] - scores[scores.length - 1]) /
            scores[scores.length - 1]) *
          100
        : 0;

    let streak = 0;
    if (updatedHistory.length) {
      streak = 1;
      let lastDate = new Date(updatedHistory[0].date);

      for (let i = 1; i < updatedHistory.length; i++) {
        const currentDate = new Date(updatedHistory[i].date);
        const diff =
          (lastDate - currentDate) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
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

  if (isLoading)
    return (
      <div className="text-center mt-10 animate-pulse">
        Loading dashboard...
      </div>
    );

  const displayName =
    user?.name ||
    JSON.parse(localStorage.getItem("user"))?.name ||
    "User";

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
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? "Light ☀️" : "Dark 🌙"}
        </button>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          ["Mood", userStats.moodTrend],
          ["Consistency", userStats.consistency],
          ["Improvement", userStats.improvement],
          ["Streak", userStats.streak]
        ].map(([label, value], i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
            <p className="text-sm text-gray-500">{label}</p>
            <h2 className="text-xl font-bold">
              {label === "Consistency"
                ? `${value}/7`
                : label === "Streak"
                ? `${value} days`
                : `${Number(value).toFixed(1)}%`}
            </h2>
          </div>
        ))}
      </div>

      {/* ===== Progress ===== */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Stress", value: userStats.stress, icon: "🔥" },
          { label: "Anxiety", value: userStats.anxiety, icon: "🌪️" },
          { label: "Mood", value: userStats.moodIndex, icon: "🌞" }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
            <h3>{item.icon} {item.label}</h3>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="bg-blue-500 h-2 rounded" style={{ width: `${item.value}%` }} />
            </div>
            <p className="mt-2 font-bold">{item.value}%</p>
          </div>
        ))}
      </div>

      {/* ===== Activities ===== */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Activities</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {WELLNESS_ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              onClick={() => {
                setSelectedActivity(activity);
                setShowActivityGuide(false);
              }}
              className={`p-4 rounded-2xl text-white cursor-pointer bg-gradient-to-r ${activity.color}`}
            >
              <h3>{activity.icon} {activity.name}</h3>
              <p>{activity.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Timeline ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Timeline</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl">
          {userStats.history.length ? (
            userStats.history.map((item, i) => (
              <div key={i} className="flex justify-between border-b py-2">
                <span>{item.date}</span>
                <span>{item.emotion}</span>
                <span>{item.score}%</span>
              </div>
            ))
          ) : (
            <p>No data yet</p>
          )}
        </div>
      </div>

      {/* ===== Modal ===== */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-80">
            <h3>{selectedActivity.name}</h3>

            {!showActivityGuide ? (
              <button
                onClick={() => setShowActivityGuide(true)}
                className="bg-blue-500 text-white w-full py-2 mt-4"
              >
                Start
              </button>
            ) : (
              <p className="mt-4">
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