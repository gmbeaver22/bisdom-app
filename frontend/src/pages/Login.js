import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const history = useHistory();

  // Handle changes to the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Handle form submission
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
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        setStatus("Login successful!");
        localStorage.setItem("token", data.token);
        history.push("/domains");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
      setStatus("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {status && <div style={{ color: "blue" }}>{status}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            style={{ padding: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            style={{ padding: "5px" }}
          />
        </div>
        <button type="submit" style={{ padding: "5px 10px" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
