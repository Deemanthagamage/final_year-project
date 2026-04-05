import React, { useState, useEffect, useRef } from "react";

export default function GuidedMeditation({ onClose, sessionSeconds = 300 }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionSeconds);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let timer;
    if (hasStarted && !isComplete) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [hasStarted, isComplete]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleReset = () => {
    setHasStarted(false);
    setIsComplete(false);
    setTimeLeft(sessionSeconds);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-white/40 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Guided Meditation</h3>
        <button
          onClick={() => {
            onClose();
            if (audioRef.current) audioRef.current.pause();
          }}
          className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold"
        >
          x
        </button>
      </div>

      {!hasStarted && !isComplete && (
        <div>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Close your eyes, focus on your breathing, and relax for 5 minutes.
          </p>
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
          >
            Start Meditation
          </button>
        </div>
      )}

      {(hasStarted || isComplete) && (
        <div className="text-center">
          {!isComplete && (
            <>
              <div className="text-3xl font-bold mb-2">{timeLeft}s</div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Focus on your breath and let go of tension.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleReset}
                  className="bg-gray-200 dark:bg-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (audioRef.current) audioRef.current.pause();
                  }}
                  className="bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </>
          )}
          {isComplete && (
            <p className="text-gray-600 dark:text-gray-300">
              Great job! You completed your meditation session.
            </p>
          )}
        </div>
      )}

      {/* ===== Calm background audio ===== */}
      <audio
        ref={audioRef}
        loop
        src="https://https://www.chosic.com/free-music/relaxing/calm-background-music-118/"
      />
    </div>
  );
}