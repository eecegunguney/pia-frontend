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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginService(username, password);
      login(user, rememberMe);
      navigate("/dashboard");
    } catch (err) {
      setError("Username or password is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const checkCapsLock = (e) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  return (
    <div className="login-container">
      {/* Dynamic Ambient Glow Spheres in background */}
      <div className="glow-sphere sphere-1"></div>
      <div className="glow-sphere sphere-2"></div>

      <div className="login-card">
        <div className="brand-logo-badge">
          <Lock size={22} className="logo-icon-glow" />
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
    </div>
  );
}