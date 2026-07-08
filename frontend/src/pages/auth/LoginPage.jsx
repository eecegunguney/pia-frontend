import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

import { login as loginService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Intro steps: 0: Typing "People in Action", 1: Morphing to "PiA", 2: Login card entry
  const [introStep, setIntroStep] = useState(0);

  // Welcome user state to show welcome overlay before routing
  const [welcomeUser, setWelcomeUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    const timer1 = setTimeout(() => {
      setIntroStep(1);
    }, 2000);

    const timer2 = setTimeout(() => {
      setIntroStep(2);
    }, 4300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const authenticatedUser = await loginService(username, password);
      setWelcomeUser(authenticatedUser);

      // Wait for 2.2 seconds before setting auth state and redirecting
      setTimeout(() => {
        login(authenticatedUser, rememberMe);
        navigate("/dashboard");
      }, 2200);
    } catch (err) {
      setError("Username or password is incorrect.");
      setLoading(false);
    }
  };

  const checkCapsLock = (e) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  const displayName = welcomeUser
    ? (welcomeUser.first_name ? `${welcomeUser.first_name} ${welcomeUser.last_name || ""}` : username)
    : "";

  return (
    <div className="login-container">
      {/* Dynamic Ambient Glow Spheres in background */}
      <div className="glow-sphere sphere-1"></div>
      <div className="glow-sphere sphere-2"></div>

      {welcomeUser ? (
        <div className="welcome-overlay">
          <div className="welcome-text">
            {`Welcome Back, ${displayName}`.split("").map((char, idx) => (
              <span
                key={idx}
                className="welcome-letter"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>
      ) : introStep < 2 ? (
        <div className="intro-overlay">
          <div className={`typing-text ${introStep === 1 ? "morphing" : ""}`}>
            {"People in Action".split("").map((char, idx) => {
              const isPia = idx === 0 || idx === 7 || idx === 10;
              return (
                <span
                  key={idx}
                  className={`letter ${isPia ? "pia-letter" : "fade-letter"}`}
                  style={{ 
                    animationDelay: introStep === 0 ? `${idx * 60}ms` : "0ms" 
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="login-card login-card-entrance">
          <div className="brand-logo-badge">
            <span className="logo-text-glow">PiA</span>
          </div>

          <h1>Customer Inventory Management</h1>
          <p>Please sign in to access your portal</p>

          <form onSubmit={handleLogin}>
            {/* Username Field */}
            <div className="input-group">
              <input
                type="text"
                id="username"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="username">Username</label>
              <User size={18} className="input-icon" />
            </div>

            {/* Password Field */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={checkCapsLock}
                onKeyUp={checkCapsLock}
                required
                disabled={loading}
              />
              <label htmlFor="password">Password</label>
              <Lock size={18} className="input-icon" />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Caps Lock Indicator */}
            {capsLockActive && (
              <div className="caps-lock-warning">
                <span className="caps-lock-dot"></span>
                <span>Caps Lock is ON</span>
              </div>
            )}

            {/* Form Options (Remember Me / Forgot Password) */}
            <div className="form-options-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => alert("Password recovery request has been sent to your system administrator.")}
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="error-message-box">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`submit-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}