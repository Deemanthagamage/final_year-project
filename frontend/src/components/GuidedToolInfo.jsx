import React, { useState } from "react";

const MENTAL_HEALTH_INFO = [
  {
    title: "Common Signs to Notice",
    points: [
      "Persistent sadness, worry, or mood swings.",
      "Sleep changes, appetite changes, or low energy.",
      "Difficulty concentrating or feeling overwhelmed by daily tasks."
    ]
  },
  {
    title: "Stress Management",
    points: [
      "Use short breathing exercises throughout the day.",
      "Take regular breaks and reduce multitasking.",
      "Talk to trusted people and avoid isolating yourself."
    ]
  },
  {
    title: "Self-Care Tips",
    points: [
      "Maintain a simple routine for sleep, meals, and movement.",
      "Journal thoughts and emotions to identify patterns.",
      "Set small daily goals and celebrate progress."
    ]
  }
];

const DOCTOR_REPORT_WORKFLOW = [
  {
    step: "Assessment",
    detail:
      "Doctors begin with interviews, symptom checklists, and medical history to understand current mental health status."
  },
  {
    step: "Monitoring",
    detail:
      "Progress is tracked through follow-up visits, mood trends, behavior patterns, and response to interventions."
  },
  {
    step: "Treatment Plans",
    detail:
      "Care plans may include therapy, lifestyle adjustments, and medication when needed, tailored to individual goals."
  },
  {
    step: "Follow-Ups",
    detail:
      "Regular reviews are used to adjust treatment, reinforce coping strategies, and prevent relapse."
  }
];

export default function GuidedToolInfo({ title = "Guided Tool" }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <button
          type="button"
          onClick={() => setShowInfo((previous) => !previous)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:shadow-lg transition-shadow"
        >
          {showInfo ? "Hide Mental Health Info" : "View Mental Health Info"}
        </button>
      </div>

      {showInfo && (
        <div className="guided-tool-info-fade space-y-6">
          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-600 mb-3">
              Mental Health Essentials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {MENTAL_HEALTH_INFO.map((section) => (
                <article
                  key={section.title}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  <h5 className="font-semibold text-slate-800 mb-2">{section.title}</h5>
                  <ul className="space-y-1 text-sm text-slate-600 list-disc pl-5">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-600 mb-3">
              How Doctors Manage Mental Health Reports
            </h4>
            <div className="space-y-3">
              {DOCTOR_REPORT_WORKFLOW.map((item) => (
                <article
                  key={item.step}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <h5 className="font-semibold text-slate-800 mb-1">{item.step}</h5>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .guided-tool-info-fade {
          animation: guidedToolInfoFadeIn 320ms ease-out;
        }

        @keyframes guidedToolInfoFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
