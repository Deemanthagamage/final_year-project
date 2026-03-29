import React, { useState } from "react";

const STRESS_RELIEF_EXERCISES = [
  {
    id: "exercise-1",
    title: "Deep Breathing",
    description: "Inhale for 4 seconds, hold for 4 seconds, and exhale for 6 seconds. Repeat for 2 minutes.",
  },
  {
    id: "exercise-2",
    title: "Body Scan",
    description: "Slowly move your attention from head to toe and notice tension without judging it.",
  },
  {
    id: "exercise-3",
    title: "Progressive Muscle Relaxation",
    description: "Tense and release each muscle group one at a time to reduce physical stress.",
  },
];

const JOURNALING_PROMPTS = [
  {
    id: "prompt-1",
    text: "What made you feel grateful today?",
  },
  {
    id: "prompt-2",
    text: "Describe a moment of calm you experienced today.",
  },
  {
    id: "prompt-3",
    text: "What is one stress trigger you handled better today, and how?",
  },
];

export default function GuidedTool({ sectionTitle = "Guided Tool" }) {
  const [showContent, setShowContent] = useState(false);

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-semibold text-slate-800">{sectionTitle}</h3>
        <button
          type="button"
          onClick={() => setShowContent((previous) => !previous)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:shadow-lg transition-shadow"
        >
          {showContent ? "Hide Exercises" : "Start Exercises"}
        </button>
      </div>

      {showContent && (
        <div className="space-y-6 guided-tool-fade-in">
          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-600 mb-3">
              Stress-Relief Exercises
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STRESS_RELIEF_EXERCISES.map((exercise, index) => (
                <article
                  key={exercise.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 guided-tool-card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <h5 className="font-semibold text-slate-800 mb-1">{exercise.title}</h5>
                  <p className="text-sm text-slate-600">{exercise.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-600 mb-3">
              Journaling Prompts
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {JOURNALING_PROMPTS.map((prompt, index) => (
                <article
                  key={prompt.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 guided-tool-card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <p className="text-sm text-slate-700">{prompt.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .guided-tool-fade-in {
          animation: guidedToolFadeIn 320ms ease-out;
        }

        .guided-tool-card {
          opacity: 0;
          transform: translateY(8px) scale(1);
          animation: guidedToolItemIn 360ms ease-out forwards;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .guided-tool-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        @keyframes guidedToolFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes guidedToolItemIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(1);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
