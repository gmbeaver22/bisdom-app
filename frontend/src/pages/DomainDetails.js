import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../styles/forms.css";

const DomainDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/domains/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDomain(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch domain:", err);
        setError("Failed to load domain details");
        setLoading(false);
      }
    };

    fetchDomain();
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!domain) return <div>Domain not found</div>;

  return (
    <div className="form-container">
      <h2 className="form-title">Domain Details</h2>
      <div className="form-group">
        <label className="form-label">Name:</label>
        <div className="form-value">{domain.name}</div>
      </div>
      <div className="form-group">
        <label className="form-label">Description:</label>
        <div className="form-value">{domain.description}</div>
      </div>
      <div className="form-group">
        <label className="form-label">Created:</label>
        <div className="form-value">
          {new Date(domain.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="button-group">
        <Link to="/domains" className="form-button">
          Back to Domains
        </Link>
      </div>
    </div>
  );
};

export default DomainDetails;
