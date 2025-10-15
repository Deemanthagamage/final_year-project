import React from "react";

export default function Footer() {
  return (
    <footer className="mt-8 py-6 bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-500 text-white text-center shadow-2xl rounded-t-3xl border-t border-indigo-200">
      <span className="font-bold tracking-wide text-lg drop-shadow">© {new Date().getFullYear()} DivineMind — Built for mental wellbeing.</span>
    </footer>
  );
}
