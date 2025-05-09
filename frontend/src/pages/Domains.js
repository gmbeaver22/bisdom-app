import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Domains = () => {
  const { token } = useAuth();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchDomains = async () => {
      try {
        console.log("Fetching domains with token:", token); // Debug log
        const res = await axios.get("http://localhost:5001/api/domains", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDomains(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch domains:", err);
        setError("Failed to fetch domains");
        setLoading(false);
      }
    };
    fetchDomains();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Business Domains</h2>
      {domains.length === 0 ? (
        <p>No domains found. Create your first domain!</p>
      ) : (
        <ul>
          {domains.map((domain) => (
            <li key={domain._id}>
              {domain.name} - {domain.description}{" "}
              <Link to={`/domains/${domain._id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/domains/new">Add New Domain</Link>
    </div>
  );
};

export default Domains;
