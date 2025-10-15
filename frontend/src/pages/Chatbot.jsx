import React, { useState, useEffect, useRef } from "react";

export default function Chatbot() {
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
      <h2 className="text-2xl font-semibold mb-4">Chat with DivineMind (AI Companion)</h2>
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
