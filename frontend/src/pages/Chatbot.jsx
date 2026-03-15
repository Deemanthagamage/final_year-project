import React, { useState, useEffect, useRef } from "react";

const SINGLE_MODE_QUESTIONS = [
  "How would you rate your overall mood in the past week? (1-10)",
  "How often do you feel stressed or anxious during a typical day?",
  "How well have you been sleeping recently? Describe your sleep patterns.",
  "Do you find yourself enjoying activities you used to love? Explain.",
  "How would you describe your energy levels throughout the day?",
  "How often do you feel overwhelmed by daily tasks and responsibilities?",
  "How connected do you feel to your friends and family?",
  "Have you been experiencing any persistent negative thoughts? Describe them.",
  "How do you typically cope with difficult situations or emotions?",
  "On a scale of 1-10, how hopeful do you feel about your future?"
];

export default function Chatbot({ onNavigate }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello — I am Assestence. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState("single");
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [groupUsers, setGroupUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupInput, setGroupInput] = useState("");
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupStatus, setGroupStatus] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupMessages, chatMode]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      if (!saved) return;
      setCurrentUser(JSON.parse(saved));
    } catch (error) {
      console.error("Failed to parse current user:", error);
    }
  }, []);

  useEffect(() => {
    if (chatMode !== "group" || !currentUser?.id) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user-chat/users/${currentUser.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load users");
        }

        setGroupUsers(data.users || []);
      } catch (error) {
        setGroupStatus(error.message);
      }
    };

    fetchUsers();
  }, [chatMode, currentUser]);

  useEffect(() => {
    if (chatMode !== "group" || !currentUser?.id || !selectedUser?.id) return;

    let intervalId;

    const fetchConversation = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/user-chat/messages?userId=${currentUser.id}&peerId=${selectedUser.id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load messages");
        }

        setGroupMessages(data.messages || []);
      } catch (error) {
        setGroupStatus(error.message);
      }
    };

    fetchConversation();
    intervalId = setInterval(fetchConversation, 4000);

    return () => clearInterval(intervalId);
  }, [chatMode, currentUser, selectedUser]);

  async function send() {
    if (!input.trim() || isLoading) return;
    
    console.log('=== SEND BUTTON CLICKED ===');
    console.log('User message:', input);
    
    const userMsg = { from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending request to: http://localhost:4000/api/chatbot/chat');
      console.log('Request body:', { message: currentInput, conversationHistory: messages });
      
      // Call backend chatbot API with Gemini
      const response = await fetch('http://localhost:4000/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput,
          conversationHistory: messages 
        })
      });

      console.log('Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Response not OK:', data);
        throw new Error(data.error || 'Failed to get response');
      }

      console.log('Bot reply:', data.reply);
      console.log('=== REQUEST COMPLETE ===');
      
      setMessages((m) => [...m, { from: "bot", text: data.reply }]);
    } catch (error) {
      console.error('=== CHAT ERROR ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      console.error('==================');
      
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

  async function sendGroupMessage() {
    if (!groupInput.trim() || !currentUser?.id || !selectedUser?.id || groupLoading) {
      return;
    }

    setGroupLoading(true);
    setGroupStatus("");

    try {
      const response = await fetch('http://localhost:4000/api/user-chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          recipientId: selectedUser.id,
          text: groupInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setGroupInput("");
      setGroupMessages((prev) => [...prev, data.data]);
    } catch (error) {
      setGroupStatus(error.message);
    } finally {
      setGroupLoading(false);
    }
  }

  function handleGroupKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendGroupMessage();
    }
  }

  const activeQuestions = SINGLE_MODE_QUESTIONS;
  const chatPanelBackground = {
    backgroundImage:
      "linear-gradient(rgba(248, 250, 252, 0.72), rgba(241, 245, 249, 0.68)), url('https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1400&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Chat with Assestence (AI Companion)</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => {
            if (onNavigate) {
              onNavigate("mood");
              return;
            }
            setChatMode("single");
            setShowQuestions(true);
          }}
          className={`rounded-xl border p-3 text-left transition-all ${
            chatMode === "single"
              ? "bg-indigo-600 text-white border-indigo-600 shadow"
              : "bg-white/80 text-slate-700 border-slate-200 hover:border-indigo-300"
          }`}
        >
          <div className="font-semibold">Single</div>
          <div className={`text-sm ${chatMode === "single" ? "text-indigo-100" : "text-slate-500"}`}>
            Individual check-in questions
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setChatMode("group");
            setShowQuestions(false);
          }}
          className={`rounded-xl border p-3 text-left transition-all ${
            chatMode === "group"
              ? "bg-indigo-600 text-white border-indigo-600 shadow"
              : "bg-white/80 text-slate-700 border-slate-200 hover:border-indigo-300"
          }`}
        >
          <div className="font-semibold">Group</div>
          <div className={`text-sm ${chatMode === "group" ? "text-indigo-100" : "text-slate-500"}`}>
            Group chat mode
          </div>
        </button>
      </div>

      {chatMode === "single" && showQuestions && (
        <div className="mb-4 rounded-xl bg-white/70 border border-slate-200 p-3">
          <div className="text-sm font-semibold text-slate-700 mb-2">Single Questions</div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-auto mt-3">
            {activeQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => setInput(question)}
                className="text-left text-sm px-3 py-2 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {chatMode === "single" ? (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col h-[420px]" style={chatPanelBackground}>
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
      ) : (
        <div className="bg-white rounded-lg shadow p-4 h-[520px] grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1 border border-slate-200 rounded-xl p-3 overflow-auto">
            <div className="font-semibold text-slate-800 mb-3">Registered Users</div>
            {!currentUser?.id && (
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                Login required to use group messaging.
              </div>
            )}
            <div className="space-y-2">
              {groupUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedUser?.id === u.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 border border-slate-200 rounded-xl p-3 flex flex-col">
            <div className="font-semibold text-slate-800 mb-3">
              {selectedUser ? `Chat with ${selectedUser.name}` : 'Select a user to start chatting'}
            </div>

            <div className="flex-1 overflow-auto space-y-2 pr-1">
              {groupMessages.map((m) => {
                const mine = String(m.senderId) === String(currentUser?.id);
                return (
                  <div key={m._id} className={`max-w-[85%] p-3 rounded-lg ${mine ? 'ml-auto bg-indigo-100' : 'bg-sky-50'}`}>
                    <div className="text-sm">{m.text}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {groupStatus && (
              <div className="mt-2 text-sm text-red-600">{groupStatus}</div>
            )}

            <div className="mt-3 flex gap-2">
              <input
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
                onKeyPress={handleGroupKeyPress}
                disabled={!selectedUser || !currentUser?.id || groupLoading}
                className="flex-1 border rounded p-2 disabled:opacity-50"
                placeholder={selectedUser ? `Message ${selectedUser.name}...` : 'Select a user first'}
              />
              <button
                onClick={sendGroupMessage}
                disabled={!selectedUser || !currentUser?.id || groupLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50 hover:bg-indigo-700 transition-colors"
              >
                {groupLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
