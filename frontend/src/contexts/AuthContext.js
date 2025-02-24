import React, { createContext, useState, useEffect, useContext } from "react";
import apiService from "../services/api";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app and provide auth state
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Check for existing token in localStorage on mount
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, [token]);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await apiService.login({ username, password });
      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      return true; // Indicate success
    } catch (err) {
      console.error("Login failed", err);
      return false; // Indicate failure
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };

  // Value provided to context consumers
  const authContextValue = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
    setToken,
  };

  // Render children only after loading is complete
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };
