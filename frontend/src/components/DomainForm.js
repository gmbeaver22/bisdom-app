import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../styles/forms.css";

const DomainForm = () => {
  const [domain, setDomain] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const history = useHistory();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/domains/new", domain, {
        headers: { Authorization: `Bearer ${token}` },
      });
      history.push("/domains");
    } catch (err) {
      console.error("Failed to save domain", err);
      setError("Failed to save domain");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create New Domain</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-input"
            value={domain.name}
            onChange={(e) => setDomain({ ...domain, name: e.target.value })}
            required
            placeholder="Enter domain name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            className="form-textarea"
            value={domain.description}
            onChange={(e) =>
              setDomain({ ...domain, description: e.target.value })
            }
            required
            placeholder="Enter domain description"
          />
        </div>
        <button type="submit" className="form-button">
          Save Domain
        </button>
      </form>
    </div>
  );
};

export default DomainForm;
