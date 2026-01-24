import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!username || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      // Call backend login API
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      setError("");
      const userData = {
        username: data.user.username,
        email: data.user.email,
        loginDate: new Date().toLocaleDateString()
      };
      
      if (onLogin) onLogin(userData);
    } catch (err) {
      setError('Failed to connect to server: ' + err.message);
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.backgroundOverlay}></div>
      
      <div style={styles.container}>
        <div style={styles.formCard}>
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>🔐</span>
            </div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠️</span>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelText}>Username</span>
                <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelText}>Password</span>
                <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordButton}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.submitButtonDisabled : {}),
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span style={styles.loadingSpinner}>⏳ Logging in...</span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 118, 171, 0.3), transparent 50%)",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: "450px",
    position: "relative",
    zIndex: 1,
  },
  formCard: {
    background: "white",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    animation: "fadeInUp 0.6s ease-out",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  iconContainer: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    marginBottom: "16px",
    boxShadow: "0 8px 16px rgba(102, 126, 234, 0.4)",
  },
  icon: {
    fontSize: "40px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#718096",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "#fed7d7",
    border: "1px solid #fc8181",
    borderRadius: "12px",
    animation: "shake 0.5s",
  },
  errorIcon: {
    fontSize: "20px",
  },
  errorText: {
    color: "#c53030",
    fontSize: "14px",
    margin: 0,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
  },
  labelText: {
    marginRight: "4px",
  },
  required: {
    color: "#e53e3e",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "18px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    fontSize: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s",
    boxSizing: "border-box",
  },
  showPasswordButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    padding: "8px",
  },
  submitButton: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s",
    marginTop: "8px",
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};
