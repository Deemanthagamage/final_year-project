import React, { useState } from "react";

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [married, setMarried] = useState("");
  const [employment, setEmployment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const steps = [
    { number: 1, title: "Account", icon: "👤" },
    { number: 2, title: "Profile", icon: "📝" },
    { number: 3, title: "Complete", icon: "✨" }
  ];

  const maritalOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" }
  ];

  const employmentOptions = [
    { value: "Employed", label: "Employed" },
    { value: "Unemployed", label: "Unemployed" },
    { value: "Student", label: "Student" },
    { value: "Retired", label: "Retired" },
    { value: "Self-Employed", label: "Self-Employed" }
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    // Enhanced validation
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      // Call backend API
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, age, married, employment })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setIsLoading(false);
        return;
      }

      setError("");
      const userData = {
        username,
        email,
        age: age || "Not specified",
        married: married || "Not specified",
        employment: employment || "Not specified",
        joinDate: new Date().toLocaleDateString()
      };
      
      if (onSignup) onSignup(userData);
    } catch (err) {
      setError('Failed to connect to server: ' + err.message);
      setIsLoading(false);
    }
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1 fields before proceeding
      if (!username || !email || !password || !confirmPassword) {
        setError("Please fill in all required fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    setError("");
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const InputField = ({ label, type, value, onChange, required = false, optional = false, placeholder, ...props }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label} 
        {optional && <span className="text-slate-400 ml-1">(optional)</span>}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-slate-300"
          {...props}
        />
        {type === 'password' && value && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
    </div>
  );

  const SelectField = ({ label, value, onChange, options, optional = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label} 
        {optional && <span className="text-slate-400 ml-1">(optional)</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 appearance-none cursor-pointer"
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-cyan-200/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-110' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <span className="text-sm font-semibold">{step.icon}</span>
                  </div>
                  <div className={`text-sm font-medium transition-colors duration-300 ${
                    currentStep >= step.number ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 transition-colors duration-300 ${
                      currentStep > step.number ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-slate-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  DM
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Join DivineMind
                </h1>
              </div>
              <p className="text-slate-600">Start your mental wellness journey with us today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Account Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Username <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-slate-300"
                      placeholder="Choose a unique username"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Email <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-slate-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Password <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-slate-300"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Confirm Password <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-slate-300"
                      placeholder="Re-enter your password"
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Password Strength</span>
                        <span className={`text-sm font-semibold ${
                          password.length >= 8 ? 'text-emerald-600' : 
                          password.length >= 6 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {password.length >= 8 ? 'Strong' : password.length >= 6 ? 'Medium' : 'Weak'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            password.length >= 8 ? 'bg-emerald-500 w-full' : 
                            password.length >= 6 ? 'bg-amber-500 w-2/3' : 'bg-red-500 w-1/3'
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Profile Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <InputField
                    label="Age"
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    optional
                    placeholder="Your age"
                    min="13"
                    max="120"
                  />
                  <SelectField
                    label="Marital Status"
                    value={married}
                    onChange={e => setMarried(e.target.value)}
                    options={maritalOptions}
                    optional
                  />
                  <SelectField
                    label="Employment Status"
                    value={employment}
                    onChange={e => setEmployment(e.target.value)}
                    options={employmentOptions}
                    optional
                  />

                  {/* Benefits Preview */}
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-500 text-lg">💫</div>
                      <div className="text-sm text-blue-700">
                        <div className="font-semibold mb-1">Personalized Experience</div>
                        This information helps us tailor your wellness journey to your specific needs and lifestyle.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Complete */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <h3 className="font-semibold text-slate-800 text-lg mb-4">Review Your Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <div className="text-slate-500 text-xs">Username</div>
                          <div className="font-medium text-slate-800">{username}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs">Email</div>
                          <div className="font-medium text-slate-800">{email}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-slate-500 text-xs">Age</div>
                          <div className="font-medium text-slate-800">{age || "Not specified"}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs">Marital Status</div>
                          <div className="font-medium text-slate-800">{married || "Not specified"}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                      <div className="text-slate-500 text-xs mb-1">Employment Status</div>
                      <div className="font-medium text-slate-800">{employment || "Not specified"}</div>
                    </div>
                  </div>

                  {/* Welcome Benefits */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-3">Welcome to DivineMind! 🎉</h4>
                    <div className="space-y-2 text-sm text-emerald-700">
                      <div className="flex items-center space-x-2">
                        <span>✓</span>
                        <span>Personalized wellness dashboard</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✓</span>
                        <span>24/7 AI companion support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✓</span>
                        <span>Mood tracking and insights</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✓</span>
                        <span>Guided meditation and tools</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-shake">
                  <div className="flex items-center space-x-2 text-red-700">
                    <span>⚠️</span>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-4 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-300 transform hover:scale-105"
                  >
                    ← Back
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create My Account ✨"
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-sm text-slate-500 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <span>🔒</span>
            <span>256-bit SSL Encryption • Your privacy is protected</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}