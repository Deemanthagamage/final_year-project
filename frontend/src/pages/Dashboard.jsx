import React, { useState, useEffect } from 'react';

// Mock data with enhanced structure
const EMOTION_DATA = {
  history: [
    { date: "2025-10-08", emotion: "Neutral", score: 65, duration: 12, activities: ["Breathing", "Journal"] },
    { date: "2025-10-09", emotion: "Calm", score: 78, duration: 18, activities: ["Meditation"] },
    { date: "2025-10-10", emotion: "Happy", score: 85, duration: 25, activities: ["Exercise", "Social"] },
    { date: "2025-10-11", emotion: "Not checked", score: 0, duration: 0, activities: [] }
  ],
  trends: {
    mood: "+12%",
    consistency: "5/7 days",
    improvement: "15% better",
    streak: "3 days"
  }
};

const WELLNESS_ACTIVITIES = [
  { 
    id: 1,
    name: "Breathing Exercise", 
    duration: "5 min", 
    icon: "🌬️",
    description: "Calm your nervous system",
    category: "Quick Relief",
    effectiveness: 85,
    color: "from-blue-400 to-cyan-400"
  },
  { 
    id: 2,
    name: "Guided Meditation", 
    duration: "10 min", 
    icon: "🧘",
    description: "Audio relaxation session",
    category: "Mindfulness",
    effectiveness: 92,
    color: "from-purple-400 to-pink-400"
  },
  { 
    id: 3,
    name: "Gratitude Journal", 
    duration: "3 min", 
    icon: "📝",
    description: "Express your thoughts",
    category: "Reflection",
    effectiveness: 78,
    color: "from-amber-400 to-orange-400"
  },
  { 
    id: 4,
    name: "Body Scan", 
    duration: "8 min", 
    icon: "✨",
    description: "Progressive relaxation",
    category: "Awareness",
    effectiveness: 88,
    color: "from-emerald-400 to-green-400"
  }
];

const EMOTION_CONFIG = {
  Stressed: { icon: "😰", color: "from-red-400 to-pink-500", bg: "bg-red-50", text: "text-red-700" },
  Anxious: { icon: "😟", color: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
  Happy: { icon: "😊", color: "from-emerald-400 to-green-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  Calm: { icon: "😌", color: "from-blue-400 to-cyan-500", bg: "bg-blue-50", text: "text-blue-700" },
  Neutral: { icon: "😐", color: "from-slate-400 to-gray-500", bg: "bg-slate-50", text: "text-slate-700" }
};

export default function AdvancedDashboard({ emotion }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setMoodData(EMOTION_DATA.history.filter(item => item.score > 0));
      setIsLoading(false);
    }, 1000);
  }, []);

  const getProgressData = () => [
    { 
      label: "Stress Level", 
      value: emotion?.label === "Stressed" ? 82 : 40,
      trend: emotion?.label === "Stressed" ? "+18%" : "-5%",
      ...EMOTION_CONFIG.Stressed,
      icon: "🔥"
    },
    { 
      label: "Anxiety Score", 
      value: emotion?.label === "Anxious" ? 70 : 35,
      trend: emotion?.label === "Anxious" ? "+12%" : "-8%",
      ...EMOTION_CONFIG.Anxious,
      icon: "🌪️"
    },
    { 
      label: "Mood Index", 
      value: emotion?.label === "Happy" ? 88 : 60,
      trend: emotion?.label === "Happy" ? "+15%" : "+3%",
      ...EMOTION_CONFIG.Happy,
      icon: "🌞"
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  const progressData = getProgressData();
  const currentEmotion = emotion?.label ? EMOTION_CONFIG[emotion.label] : EMOTION_CONFIG.Neutral;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              MindSpace
            </h1>
            <p className="text-slate-600 mt-2">Your personalized mental wellness companion</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/20">
              <div className="text-sm text-slate-500">Current Status</div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{currentEmotion.icon}</span>
                <span className="font-semibold text-slate-700">
                  {emotion?.label || "Ready to check in"}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg">
              JS
            </div>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid xl:grid-cols-3 gap-8 mb-8">
          {/* Welcome & Stats Card */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, John! 👋</h2>
                  <p className="text-slate-600 max-w-md">
                    {emotion?.label 
                      ? `You're feeling ${emotion.label.toLowerCase()} today. Here are some personalized recommendations.`
                      : "Take a moment to check in with yourself. Your mental health matters."
                    }
                  </p>
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Check In Now
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(EMOTION_DATA.trends).map(([key, value]) => (
                  <div key={key} className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                    <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
                    <div className="text-sm text-slate-600 capitalize">{key.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emotion Card */}
          <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="text-center">
              <div className="text-6xl mb-4">{currentEmotion.icon}</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Current Emotion</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-2xl ${currentEmotion.bg} ${currentEmotion.text} font-semibold mb-4`}>
                {emotion?.label || "Not checked"}
              </div>
              <p className="text-slate-600 text-sm mb-6">
                Last check: Today at 09:42 AM
              </p>
              <button className="w-full bg-slate-800 text-white py-3 rounded-2xl font-semibold hover:bg-slate-700 transition-colors">
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {progressData.map((metric, index) => (
            <div key={metric.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{metric.icon}</div>
                  <div>
                    <div className="font-semibold text-slate-800">{metric.label}</div>
                    <div className="text-sm text-slate-500">Weekly average</div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${
                  metric.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'
                }`}>
                  {metric.trend}
                </div>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${metric.value}%` }}
                    className={`h-full rounded-full bg-gradient-to-r ${metric.color} shadow-sm transition-all duration-1000 ease-out group-hover:shadow-md`}
                  />
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-800">{metric.value}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid xl:grid-cols-2 gap-8">
          {/* Wellness Activities */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Recommended Activities</h3>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">AI Personalized</span>
            </div>
            
            <div className="space-y-4">
              {WELLNESS_ACTIVITIES.map((activity) => (
                <div 
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity)}
                  className="group p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${activity.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <div className="font-semibold text-slate-800 group-hover:text-blue-700">
                          {activity.name}
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {activity.category}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        {activity.description}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>⏱️ {activity.duration}</span>
                        <span>🎯 {activity.effectiveness}% effective</span>
                      </div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 text-sm px-3 py-2 rounded-xl font-semibold group-hover:bg-blue-200 transition-colors">
                      Start
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emotion Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Emotion Timeline</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                  7 days
                </button>
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full transition-colors">
                  30 days
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {moodData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-white transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                      EMOTION_CONFIG[entry.emotion]?.bg || 'bg-slate-100'
                    }`}>
                      {EMOTION_CONFIG[entry.emotion]?.icon || '📊'}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{entry.emotion}</div>
                      <div className="text-sm text-slate-500">{entry.date}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          entry.score >= 80 ? "text-emerald-600" :
                          entry.score >= 60 ? "text-blue-600" :
                          "text-amber-600"
                        }`}>
                          {entry.score}%
                        </div>
                        <div className="text-xs text-slate-400">{entry.duration}min</div>
                      </div>
                      <div className="w-2 h-8 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`w-full rounded-full transition-all duration-500 ${
                            entry.score >= 80 ? "bg-emerald-400" :
                            entry.score >= 60 ? "bg-blue-400" :
                            "bg-amber-400"
                          }`}
                          style={{ height: `${entry.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Weekly Wellness Insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20">
              <div className="text-3xl mb-3">📈</div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">+12%</div>
              <div className="text-sm text-slate-600">Mood Improvement</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20">
              <div className="text-3xl mb-3">💪</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">5/7</div>
              <div className="text-sm text-slate-600">Active Days</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20">
              <div className="text-3xl mb-3">🎯</div>
              <div className="text-2xl font-bold text-amber-600 mb-1">80%</div>
              <div className="text-sm text-slate-600">Goals Met</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20">
              <div className="text-3xl mb-3">⏱️</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">18min</div>
              <div className="text-sm text-slate-600">Daily Average</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${selectedActivity.color} flex items-center justify-center text-3xl mx-auto mb-4`}>
                {selectedActivity.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{selectedActivity.name}</h3>
              <p className="text-slate-600 mb-6">{selectedActivity.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-100 rounded-2xl p-3">
                  <div className="text-sm text-slate-500">Duration</div>
                  <div className="font-semibold text-slate-800">{selectedActivity.duration}</div>
                </div>
                <div className="bg-slate-100 rounded-2xl p-3">
                  <div className="text-sm text-slate-500">Effectiveness</div>
                  <div className="font-semibold text-slate-800">{selectedActivity.effectiveness}%</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setSelectedActivity(null)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-2xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Maybe Later
                </button>
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}