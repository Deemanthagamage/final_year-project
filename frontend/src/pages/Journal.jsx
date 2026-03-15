import React, { useState } from "react";

const JOURNAL_PROMPTS = [
  "What emotion stood out most for you today, and why?",
  "What is one small win you had today?",
  "What would help you feel 10% better right now?"
];

const REPORT_CARDS = [
  {
    title: "Mood Score",
    value: "78/100",
    trend: "+6% this week",
    icon: "😊",
    color: "from-emerald-400 to-green-500"
  },
  {
    title: "Stress Level",
    value: "Moderate",
    trend: "-8% this week",
    icon: "🧘",
    color: "from-blue-400 to-cyan-500"
  },
  {
    title: "Sleep Quality",
    value: "7.2 hrs",
    trend: "Improving",
    icon: "🌙",
    color: "from-indigo-400 to-violet-500"
  },
  {
    title: "Energy Level",
    value: "Good",
    trend: "Stable",
    icon: "⚡",
    color: "from-amber-400 to-orange-500"
  }
];

const REPORT_INSIGHTS = [
  {
    title: "Top Trigger",
    description: "Workload pressure in the afternoon is your most common stress trigger.",
    icon: "🎯"
  },
  {
    title: "Best Support Tool",
    description: "Short breathing sessions are giving the fastest emotional reset.",
    icon: "🌿"
  },
  {
    title: "Weekly Recommendation",
    description: "Add one evening journaling session to improve sleep and reduce mental noise.",
    icon: "📝"
  }
];

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [savedAt, setSavedAt] = useState(null);

  const handleSave = () => {
    if (!entry.trim()) {
      return;
    }

    setSavedAt(new Date());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Journal</h2>
        <p className="text-slate-600 mt-2">Write freely. This is your private reflection space.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Gentle Prompts</h3>
        <ul className="space-y-2 text-slate-700 list-disc pl-5">
          {JOURNAL_PROMPTS.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Mental Health Report</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Weekly Snapshot</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REPORT_CARDS.map((card) => (
            <div key={card.title} className="rounded-2xl border border-slate-100 p-4 bg-white/70 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm text-slate-500">{card.title}</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">{card.value}</div>
                </div>
                <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center bg-gradient-to-r ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-sm text-slate-600">{card.trend}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REPORT_INSIGHTS.map((insight) => (
            <div key={insight.title} className="rounded-2xl border border-slate-100 p-4 bg-gradient-to-br from-white to-slate-50/70">
              <div className="text-xl mb-2">{insight.icon}</div>
              <div className="font-semibold text-slate-800 mb-1">{insight.title}</div>
              <p className="text-sm text-slate-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-sm">
        <label htmlFor="journal-entry" className="block font-semibold text-slate-800 mb-3">
          Today's entry
        </label>
        <textarea
          id="journal-entry"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Start writing what is on your mind..."
          className="w-full min-h-64 rounded-xl border border-slate-200 p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {savedAt ? `Last saved at ${savedAt.toLocaleTimeString()}` : "Not saved yet"}
          </p>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:shadow-lg transition-shadow"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
