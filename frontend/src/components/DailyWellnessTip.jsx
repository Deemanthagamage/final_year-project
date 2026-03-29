import React, { useState } from 'react';

const MIND_RELAXING_EXERCISES = [
  {
    id: 1,
    name: "Deep Breathing",
    description: "Inhale slowly for 4 counts, hold for 4, exhale for 6. Repeat 5 times.",
    icon: "🌬️",
    duration: "2 minutes"
  },
  {
    id: 2,
    name: "Visualization",
    description: "Close your eyes and imagine a peaceful place in detail. Engage all senses.",
    icon: "🌅",
    duration: "3 minutes"
  },
  {
    id: 3,
    name: "Progressive Muscle Relaxation",
    description: "Tense and release each muscle group from head to toe, noticing the difference.",
    icon: "💪",
    duration: "10 minutes"
  },
  {
    id: 4,
    name: "Mindful Observation",
    description: "Focus intently on an object for 5 minutes. Notice colors, textures, and details.",
    icon: "👁️",
    duration: "5 minutes"
  }
];

export default function DailyWellnessTip({ 
  title = "Body Scan", 
  description = "Slowly scan through your body from head to toe, noticing any tension without judgment.",
  icon = "✨", 
  color = "from-purple-400 to-pink-400" 
}) {
  const [showExercises, setShowExercises] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
      {!showExercises ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Daily Wellness Tip</h3>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-2xl shadow-lg`}>
              {icon}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-slate-800 text-lg">{title}</h4>
            <p className="text-slate-600 leading-relaxed">{description}</p>
          </div>

          <button
            onClick={() => setShowExercises(true)}
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors duration-200"
          >
            Try This Now
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800">Mind-Relaxing Exercises</h3>
            <button
              onClick={() => setShowExercises(false)}
              className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 flex items-center justify-center transition-colors"
              aria-label="Close exercises"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {MIND_RELAXING_EXERCISES.map((exercise, index) => (
              <div
                key={exercise.id}
                className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                style={{
                  animation: showExercises ? `slideIn 0.4s ease-out ${index * 0.08}s forwards` : 'none',
                  opacity: showExercises ? 1 : 0,
                  transform: showExercises ? 'translateY(0)' : 'translateY(10px)'
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">{exercise.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 mb-1">{exercise.name}</h4>
                    <p className="text-slate-600 text-sm mb-2 leading-relaxed">{exercise.description}</p>
                    <span className="inline-block text-xs text-slate-500 bg-white/60 px-2 py-1 rounded-lg">
                      ⏱️ {exercise.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowExercises(false)}
            className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-colors duration-200"
          >
            Back to Tip
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
