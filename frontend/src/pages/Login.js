import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const history = useHistory();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value); // Debug log
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("Attempting login...");

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("Response:", { status: response.status, data }); // Debug log

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        setStatus("Login successful!");
        login(data.token);
        history.push("/domains");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
      setStatus("");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome to Bisdom</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
      {error && <div className="status-message error">{error}</div>}
      {status && <div className="status-message success">{status}</div>}
    </div>
  );
};

export default Login;
