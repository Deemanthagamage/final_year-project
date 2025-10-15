import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MoodCheck from "./pages/MoodCheck";
import Chatbot from "./pages/Chatbot";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  const [route, setRoute] = useState("home");
  const [emotion, setEmotion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Show welcome notification on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      showNotificationMessage("Welcome to Serene! 🌟 Your mental wellness companion.", "info");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const showNotificationMessage = (message, type) => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  function handleNav(r) {
    setIsLoading(true);
    
    // Simulate loading between route changes
    setTimeout(() => {
      setRoute(r);
      setIsLoading(false);
      
      // Show relevant notifications
      if (r === "dashboard") {
        showNotificationMessage("Welcome to your dashboard! 📊", "success");
      } else if (r === "mood") {
        showNotificationMessage("Let's check in with how you're feeling today 🎭", "info");
      } else if (r === "chat") {
        showNotificationMessage("Your AI companion is ready to chat! 🤖", "info");
      }
    }, 600);
  }

  const handleEmotionResult = (emotionData) => {
    setEmotion(emotionData);
    showNotificationMessage(`Thanks for checking in! We detected you're feeling ${emotionData?.label?.toLowerCase() || 'neutral'} today.`, "success");
    setRoute("dashboard");
  };

  const handleLogin = (userData) => {
    setUser(userData);
    showNotificationMessage(`Welcome back, ${userData?.username || 'User'}! 🌟`, "success");
    setRoute("dashboard");
  };

  const handleSignup = (userData) => {
    setUser(userData);
    showNotificationMessage(`Account created successfully! Welcome to Serene, ${userData?.username || 'User'}! 🎉`, "success");
    setRoute("dashboard");
  };

  // Route configuration with animations
  const routeConfig = {
    home: { component: <Home onStart={setRoute} />, animation: "slide-in-left" },
    mood: { component: <MoodCheck onResult={handleEmotionResult} />, animation: "slide-in-right" },
    chat: { component: <Chatbot />, animation: "slide-in-up" },
    dashboard: { component: <Dashboard emotion={emotion} user={user} />, animation: "slide-in-down" },
    login: { component: <Login onLogin={handleLogin} />, animation: "scale-in" },
    signup: { component: <Signup onSignup={handleSignup} />, animation: "scale-in" }
  };

  const currentRoute = routeConfig[route];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-cyan-200/10 rounded-full blur-2xl animate-float-fast"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-pink-200/10 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      {/* Notification System */}
      <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        showNotification ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}>
        <div className={`px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm max-w-md mx-auto ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800' 
            : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-emerald-100' : 'bg-blue-100'
            }`}>
              {notification.type === 'success' ? '✅' : '💡'}
            </div>
            <p className="font-medium text-sm">{notification.message}</p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your experience...</p>
          </div>
        </div>
      )}

      <Header onNav={handleNav} currentRoute={route} user={user} />
      
      <main className="flex-1 flex items-center justify-center py-8 px-4 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className={`rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20 p-6 md:p-8 lg:p-12 transition-all duration-500 transform ${
            currentRoute?.animation === 'slide-in-left' ? 'animate-slide-in-left' :
            currentRoute?.animation === 'slide-in-right' ? 'animate-slide-in-right' :
            currentRoute?.animation === 'slide-in-up' ? 'animate-slide-in-up' :
            currentRoute?.animation === 'slide-in-down' ? 'animate-slide-in-down' :
            'animate-scale-in'
          }`}>
            {currentRoute?.component}
          </div>
        </div>
      </main>

      <Footer />

      {/* Quick Action Fab */}
      {route !== "home" && (
        <div className="fixed bottom-6 right-6 z-30">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleNav("home")}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
              title="Go Home"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🏠</span>
            </button>
            {user && (
              <button
                onClick={() => handleNav("dashboard")}
                className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
                title="Dashboard"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          33% { transform: translateX(10px) translateY(-15px); }
          66% { transform: translateX(-5px) translateY(10px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.5s ease-out;
        }
        .animate-slide-in-down {
          animation: slide-in-down 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}