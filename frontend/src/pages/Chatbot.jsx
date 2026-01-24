import React, { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello — I am Serene. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Call backend chatbot API with Gemini
      const response = await fetch('http://localhost:4000/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput,
          conversationHistory: messages 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages((m) => [...m, { from: "bot", text: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((m) => [...m, { 
        from: "bot", 
        text: "I apologize, I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
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
          {isLoading && (
            <div className="max-w-[80%] bg-sky-50 self-start p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 border rounded p-2 disabled:opacity-50"
            placeholder="Say something..."
          />
          <button 
            onClick={send} 
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
