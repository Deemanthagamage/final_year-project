import React, { useEffect, useState } from "react";

const PHASES = [
  { key: "inhale", label: "Inhale", seconds: 4, scale: 1.2, hint: "Breathe in slowly through your nose." },
  { key: "hold", label: "Hold", seconds: 4, scale: 1.2, hint: "Keep your breath gentle and steady." },
  { key: "exhale", label: "Exhale", seconds: 6, scale: 0.85, hint: "Release your breath slowly through your mouth." }
];

export default function BreathingExercise({ onClose, sessionSeconds = 120 }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(PHASES[0].seconds);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(sessionSeconds);

  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    if (!hasStarted || isComplete) {
      return;
    }

    const intervalId = setInterval(() => {
      setSessionTimeLeft((previous) => {
        if (previous <= 1) {
          setHasStarted(false);
          setIsComplete(true);
          return 0;
        }
        return previous - 1;
      });

      setPhaseTimeLeft((previous) => {
        if (previous > 1) {
          return previous - 1;
        }

        const nextPhaseIndex = (phaseIndex + 1) % PHASES.length;
        setPhaseIndex(nextPhaseIndex);
        return PHASES[nextPhaseIndex].seconds;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [hasStarted, isComplete, phaseIndex]);

  const handleStart = () => {
    setHasStarted(true);
    setIsComplete(false);
  };

  const handleReset = () => {
    setHasStarted(false);
    setIsComplete(false);
    setPhaseIndex(0);
    setPhaseTimeLeft(PHASES[0].seconds);
    setSessionTimeLeft(sessionSeconds);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-white/40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-slate-800">Breathing Exercise</h3>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
          aria-label="Close breathing exercise"
        >
          x
        </button>
      </div>

      {!hasStarted && !isComplete && (
        <div>
          <p className="text-slate-600 mb-5">Follow a calm 4-4-6 cycle for two minutes.</p>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="w-6 h-6 mt-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">1</span>
              <span className="text-slate-700">Inhale for 4 seconds as the circle grows.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-6 h-6 mt-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">2</span>
              <span className="text-slate-700">Hold for 4 seconds while staying relaxed.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-6 h-6 mt-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">3</span>
              <span className="text-slate-700">Exhale for 6 seconds as the circle shrinks.</span>
            </li>
          </ol>

          <button
            type="button"
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
          >
            Start Breathing
          </button>
        </div>
      )}

      {(hasStarted || isComplete) && (
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-wide text-blue-700 mb-2">
            {isComplete ? "Session Complete" : currentPhase.label}
          </div>

          <div className="flex justify-center mb-4">
            <div
              className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg"
              style={{
                transform: `scale(${isComplete ? 1 : currentPhase.scale})`,
                transition: `transform ${isComplete ? 0.4 : currentPhase.seconds}s linear`
              }}
            />
          </div>

          {!isComplete && (
            <div className="space-y-2 mb-5">
              <div className="text-3xl font-bold text-slate-800">{phaseTimeLeft}s</div>
              <div className="text-slate-600">{currentPhase.hint}</div>
              <div className="text-sm text-slate-500">Session time left: {sessionTimeLeft}s</div>
            </div>
          )}

          {isComplete && (
            <p className="text-slate-600 mb-5">Great work. You completed a full breathing session.</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-100 text-slate-700 py-3 rounded-2xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
