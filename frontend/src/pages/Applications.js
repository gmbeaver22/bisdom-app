import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Applications = () => {
  const { domainId } = useParams();
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/applications?domain_id=${domainId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to fetch applications");
        setLoading(false);
      }
    };
    fetchApplications();
  }, [domainId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Applications for Domain</h2>
      <ul>
        {applications.map((app) => (
          <li key={app._id}>
            {app.name} - Type: {app.type}{" "}
            <Link to={`/domains/${domainId}/applications/${app._id}/edit`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/domains/${domainId}/applications/new`}>
        Add New Application
      </Link>
    </div>
  );
};

export default Applications;
