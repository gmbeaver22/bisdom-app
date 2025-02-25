import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const BusinessRules = () => {
  const { domainId } = useParams();
  const { token } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchRules = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/businessRules?domain_id=${domainId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRules(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch business rules:", err);
        setError("Failed to fetch business rules");
        setLoading(false);
      }
    };
    fetchRules();
  }, [domainId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Business Rules for Domain</h2>
      <ul>
        {rules.map((rule) => (
          <li key={rule._id}>
            {rule.name} - Category: {rule.category}{" "}
            <Link to={`/domains/${domainId}/businessRules/${rule._id}/edit`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/domains/${domainId}/businessRules/new`}>
        Add New Business Rule
      </Link>
    </div>
  );
};

export default BusinessRules;
