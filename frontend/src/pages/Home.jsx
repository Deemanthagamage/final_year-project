import React, { useState, useEffect } from 'react';

export default function Home({ onStart, theme }) {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pageBackground = {
    backgroundImage:
      theme === 'dark'
        ? "linear-gradient(rgba(7, 11, 20, 0.82), rgba(15, 23, 42, 0.78)), url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80')"
        : "linear-gradient(rgba(248, 250, 252, 0.93), rgba(241, 245, 249, 0.9)), url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  const tips = [
    {
      title: "Mindful Breathing",
      description: "Take 90 seconds to breathe: inhale for 4, hold for 4, exhale for 6. Repeat 5 times.",
      icon: "🌬️",
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Gratitude Practice",
      description: "Write down three things you're grateful for today. This shifts focus to positive aspects.",
      icon: "🙏",
      color: "from-amber-400 to-orange-400"
    },
    {
      title: "Body Scan",
      description: "Slowly scan through your body from head to toe, noticing any tension without judgment.",
      icon: "✨",
      color: "from-purple-400 to-pink-400"
    }
  ];

  const quickTools = [
    {
      title: "Breathing Exercise",
      duration: "2 min",
      icon: "🌊",
      description: "Guided breathing for instant calm",
      type: "breathing"
    },
    {
      title: "Grounding Practice",
      duration: "5 min",
      icon: "🌍",
      description: "5-senses grounding technique",
      type: "grounding"
    }
  ];

  const wellnessImages = [
    {
      src: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=700&q=80",
      alt: "Person meditating near calm water",
      label: "Mindfulness"
    },
    {
      src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=700&q=80",
      alt: "Person journaling in a peaceful setting",
      label: "Journaling"
    },
    {
      src: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=700&q=80",
      alt: "Supportive conversation between friends",
      label: "Support"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="min-h-screen" style={pageBackground}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-cyan-200/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Hero Content */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Brand & Headline */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  S
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Welcome to</div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    DivineMind
                  </h1>
                </div>
              </div>
              
              <p className="text-xl text-slate-600 leading-relaxed">
                Your <span className="font-semibold text-slate-800">safe, private space</span> to check-in, journal, 
                and access tools to manage stress with gentle, relevant support.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform">
                  🎭
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Quick Mood Checks</div>
                  <div className="text-slate-600 text-sm">Using images or text with AI analysis</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <div>
                  <div className="font-semibold text-slate-800">24/7 AI Companion</div>
                  <div className="text-slate-600 text-sm">Always available for light, supportive conversations</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform">
                  🛠️
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Guided Tools</div>
                  <div className="text-slate-600 text-sm">Stress-relief exercises and journaling prompts</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onStart("journal")}
                className="w-full text-left flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform">
                  📖
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Journals</div>
                  <div className="text-slate-600 text-sm">Stress-relief exercises and journaling prompts</div>
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate("/mood")}
                className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Check My Mood</span>
                  <span className="group-hover:scale-110 transition-transform">🎭</span>
                </span>
              </button>

              <button 
                onClick={() => onStart("mood")}
                className="group bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-2xl font-semibold border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-white transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Check Mood</span>
                  <span className="group-hover:scale-110 transition-transform">🎭</span>
                </span>
              </button>

              
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {wellnessImages.map((image, index) => (
                <div
                  key={image.label}
                  className="wellness-card-animate relative rounded-2xl overflow-hidden border border-white/30 shadow-md group"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 to-transparent"></div>
                  <span className="absolute bottom-2 left-3 text-white text-sm font-semibold tracking-wide">
                    {image.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Daily Tips & Tools */}
          <div className={`space-y-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Daily Tip Card */}
            <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Daily Wellness Tip</h3>
                <div className="flex space-x-1">
                  {tips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTip(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTip ? 'bg-blue-500 w-6' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tips[currentTip].color} flex items-center justify-center text-2xl shadow-lg`}>
                    {tips[currentTip].icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-lg">{tips[currentTip].title}</h4>
                    <p className="text-slate-600 mt-1">{tips[currentTip].description}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors">
                    Try This Now
                  </button>
                  <button className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                    ⏱️
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Relief Tools</h3>
              
              <div className="space-y-4">
                {quickTools.map((tool, index) => (
                  <div 
                    key={tool.title}
                    className="group p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl group-hover:scale-110 transition-transform">
                          {tool.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 group-hover:text-blue-700">
                            {tool.title}
                          </div>
                          <div className="text-sm text-slate-600">
                            {tool.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {tool.duration}
                        </span>
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Footer */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>🎯 Personalized for you</span>
                  <span>🕒 Always available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="hidden md:flex justify-center gap-4 mb-6">
              {wellnessImages.slice(0, 2).map((image, index) => (
                <img
                  key={`cta-${image.label}`}
                  src={image.src}
                  alt={image.alt}
                  className="cta-image-animate w-20 h-20 rounded-2xl object-cover border-2 border-white/50 shadow-md"
                  style={{ animationDelay: `${index * 180}ms` }}
                />
              ))}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Begin Your Wellness Journey?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Join thousands who have found peace and balance through daily mindfulness practices and supportive conversations.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Start Your First Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}