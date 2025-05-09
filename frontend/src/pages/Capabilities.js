import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Capabilities = () => {
  const { domainId } = useParams();
  const { token } = useAuth();
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchCapabilities = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/capabilities?domain_id=${domainId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCapabilities(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch capabilities:", err);
        setError("Failed to fetch capabilities");
        setLoading(false);
      }
    };
    fetchCapabilities();
  }, [domainId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Capabilities for Domain</h2>
      <ul>
        {capabilities.map((capability) => (
          <li key={capability._id}>
            {capability.name} - Level: {capability.level}{" "}
            <Link
              to={`/domains/${domainId}/capabilities/${capability._id}/edit`}
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/domains/${domainId}/capabilities/new`}>
        Add New Capability
      </Link>
    </div>
  );
};

export default Capabilities;
