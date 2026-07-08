import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";

import { login as loginService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles user login.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const user = await loginService(username, password);

      login(user);

      navigate("/dashboard");
    } catch (err) {
      setError("Username or password is incorrect.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Customer Inventory Management</h1>

        <p>Please sign in to continue.</p>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <span className="error">
              {error}
            </span>
          )}

          <Button
            type="submit"
            variant="primary"
          >
            Login
          </Button>

        </form>

      </div>
    </div>
  );
}