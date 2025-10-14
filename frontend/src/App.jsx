import React, { useState, useEffect, useRef } from "react";

// === HEADER ===
function Header({ onNav }) {
  return (
    <header className="w-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Serene — Mental Health</h1>
        <nav className="space-x-4">
          <button onClick={() => onNav("home")} className="px-3 py-2 rounded hover:bg-white/20">Home</button>
          <button onClick={() => onNav("mood")} className="px-3 py-2 rounded hover:bg-white/20">Check Mood</button>
          <button onClick={() => onNav("chat")} className="px-3 py-2 rounded hover:bg-white/20">Chat</button>
          <button onClick={() => onNav("dashboard")} className="px-3 py-2 rounded hover:bg-white/20">Dashboard</button>
        </nav>
      </div>
    </header>
  );
}

// === HOME PAGE ===
function Home({ onStart }) {
  return (
    <section className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6 items-center">
      <div>
        <h2 className="text-3xl font-bold mb-3">Welcome to Serene</h2>
        <p className="mb-4 text-gray-700">
          A safe, private space to check-in, journal, and access tools to manage stress.
          Designed with local relevance and gentle support in mind.
        </p>
        <ul className="list-disc ml-5 text-gray-700 mb-6">
          <li>Quick mood checks (image or text)</li>
          <li>24/7 AI companion for light conversations</li>
          <li>Guided stress-relief tools and journaling</li>
        </ul>
        <div className="flex gap-3">
          <button onClick={() => onStart("mood")} className="px-4 py-2 bg-sky-500 text-white rounded shadow">Check My Mood</button>
          <button onClick={() => onStart("chat")} className="px-4 py-2 border border-sky-500 rounded">Chat with Bot</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold mb-3">Daily Tip</h3>
        <p className="text-gray-700 mb-4">
          Take 90 seconds to breathe: inhale for 4, hold for 4, exhale for 6. Repeat 5 times.
        </p>
        <div className="space-y-3">
          <div className="p-4 rounded bg-sky-50">Short guided breathing</div>
          <div className="p-4 rounded bg-sky-50">5-minute grounding exercise</div>
          <div className="p-4 rounded bg-sky-50">Journal prompt: "One thing I'm grateful for today"</div>
        </div>
      </div>
    </section>
  );
}

// === MOOD CHECK PAGE ===
function MoodCheck({ onResult }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImage(url);
  }

  function analyze() {
    if (!image) return alert("Please upload a selfie or an image.");
    setLoading(true);
    setTimeout(() => {
      const emotions = [
        { label: "Calm", score: 0.9 },
        { label: "Happy", score: 0.85 },
        { label: "Neutral", score: 0.7 },
        { label: "Anxious", score: 0.6 },
        { label: "Sad", score: 0.55 },
        { label: "Stressed", score: 0.5 },
      ];
      const idx = Math.floor(Math.random() * emotions.length);
      const result = emotions[idx];
      setLoading(false);
      onResult(result);
      alert(`Detected: ${result.label} (${Math.round(result.score * 100)}%)`);
    }, 900);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Mood Check (Image)</h2>
      <p className="text-gray-600 mb-4">
        Upload a recent selfie to get a quick, private mood estimate.
      </p>
      <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="h-64 w-full border border-dashed rounded flex items-center justify-center overflow-hidden bg-gray-50">
            {image ? (
              <img src={image} alt="preview" className="object-cover h-full w-full" />
            ) : (
              <div className="text-gray-400">No image selected</div>
            )}
          </div>
          <div className="mt-3 flex gap-3">
            <input ref={fileRef} accept="image/*" type="file" onChange={handleFile} className="hidden" id="mood-file" />
            <label htmlFor="mood-file" onClick={() => fileRef.current && fileRef.current.click()} className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer">Upload Photo</label>
            <button onClick={analyze} className="px-4 py-2 bg-sky-500 text-white rounded">Analyze</button>
          </div>
        </div>
        <div className="w-80 bg-sky-50 p-4 rounded">
          <h3 className="font-medium">Result</h3>
          <div className="mt-3">{loading ? "Analyzing..." : "No analysis yet."}</div>
        </div>
      </div>
    </div>
  );
}

// === CHATBOT PAGE ===
function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello — I am Serene. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply = cannedReply(userMsg.text);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    }, 700);
  }

  function cannedReply(text) {
    const t = text.toLowerCase();
    if (t.includes("sad") || t.includes("depress"))
      return "I’m sorry you feel that way. Would you like a breathing exercise?";
    if (t.includes("stress") || t.includes("anxious"))
      return "Let’s do a quick grounding exercise together.";
    return "Thanks for sharing. Tell me more, or type 'tools' to see stress-release activities.";
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Chat with Serene (AI Companion)</h2>
      <div className="bg-white rounded-lg shadow p-4 flex flex-col h-[420px]">
        <div className="flex-1 overflow-auto space-y-3 p-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] ${
                m.from === "bot" ? "bg-sky-50 self-start" : "bg-indigo-100 self-end"
              } p-3 rounded-lg`}
            >
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded p-2"
            placeholder="Say something..."
          />
          <button onClick={send} className="px-4 py-2 bg-indigo-600 text-white rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// === DASHBOARD PAGE ===
function Dashboard({ emotion }) {
  const sampleProgress = [
    { label: "Stress", value: emotion?.label === "Stressed" ? 82 : 40 },
    { label: "Anxiety", value: emotion?.label === "Anxious" ? 70 : 35 },
    { label: "Mood", value: emotion?.label === "Happy" ? 88 : 60 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {sampleProgress.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{s.label}</div>
              <div className="text-sm text-gray-500">{s.value}%</div>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded overflow-hidden">
              <div
                style={{ width: `${s.value}%` }}
                className="h-full rounded bg-gradient-to-r from-sky-500 to-indigo-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Emotion History (last 7 checks)</h3>
          <ul className="text-gray-700 list-disc ml-5">
            <li>2025-10-08 — Neutral</li>
            <li>2025-10-09 — Calm</li>
            <li>2025-10-10 — Happy</li>
            <li>2025-10-11 — {emotion?.label ?? "Not checked"}</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Recommended Toolkit</h3>
          <div className="space-y-3 text-gray-700">
            <div className="p-3 rounded bg-sky-50">5-minute breathing</div>
            <div className="p-3 rounded bg-sky-50">Guided meditation (audio)</div>
            <div className="p-3 rounded bg-sky-50">Write a 3-minute journal entry</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === MAIN APP ===
export default function App() {
  const [route, setRoute] = useState("home");
  const [emotion, setEmotion] = useState(null);

  function handleNav(r) {
    setRoute(r);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-sky-100 to-white">
      <Header onNav={handleNav} />
      <main className="flex-1 flex items-center justify-center py-10 px-2 md:px-0">
        <div className="w-full max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white/70 backdrop-blur-lg shadow-2xl border border-sky-100 p-6 md:p-10 transition-all duration-300">
            {route === "home" && <Home onStart={setRoute} />}
            {route === "mood" && <MoodCheck onResult={setEmotion} />}
            {route === "chat" && <Chatbot />}
            {route === "dashboard" && <Dashboard emotion={emotion} />}
          </div>
        </div>
      </main>
      <footer className="mt-8 py-6 bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-500 text-white text-center shadow-2xl rounded-t-3xl border-t border-indigo-200">
        <span className="font-bold tracking-wide text-lg drop-shadow">© {new Date().getFullYear()} Serene — Built for mental wellbeing.</span>
      </footer>
    </div>
  );
}
