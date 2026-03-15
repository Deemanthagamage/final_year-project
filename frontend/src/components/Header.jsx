import React from "react";

export default function Header({ onNav, theme, onToggleTheme, user, onLogout }) {
  return (
    <header className="w-full bg-gradient-to-r from-sky-600 via-blue-800 to-indigo-900 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold">DivineMind — Mental Health</h1>
        <nav className="space-x-4 flex items-center">
          <button onClick={() => onNav("home")} className="px-3 py-2 rounded hover:bg-white/20">Home</button>
          <button onClick={() => { console.log('Check Mood clicked'); onNav("mood"); }} className="px-3 py-2 rounded hover:bg-white/20">Check Mood</button>
          <button onClick={() => onNav("chat")} className="px-3 py-2 rounded hover:bg-white/20">Chat</button>
          <button onClick={() => onNav("dashboard")} className="px-3 py-2 rounded hover:bg-white/20">Dashboard</button>
          <button
            onClick={onToggleTheme}
            className="px-3 py-2 rounded bg-white/15 hover:bg-white/30 transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user ? (
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded bg-white text-indigo-700 font-semibold hover:bg-indigo-100 ml-4"
            >
              Logout
            </button>
          ) : (
            <>
              <button onClick={() => onNav("login")} className="px-3 py-2 rounded bg-white text-indigo-600 font-semibold hover:bg-indigo-100 ml-4">Login</button>
              <button onClick={() => onNav("signup")} className="px-3 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-white/20 ml-2">Signup</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
