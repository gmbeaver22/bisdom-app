import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const TechnicalComponents = () => {
  const { domainId } = useParams();
  const { token } = useAuth();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchComponents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/technicalComponents?domain_id=${domainId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComponents(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch technical components:", err);
        setError("Failed to fetch technical components");
        setLoading(false);
      }
    };
    fetchComponents();
  }, [domainId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Technical Components for Domain</h2>
      <ul>
        {components.map((component) => (
          <li key={component._id}>
            {component.name} - Type: {component.type}{" "}
            <Link
              to={`/domains/${domainId}/technicalComponents/${component._id}/edit`}
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/domains/${domainId}/technicalComponents/new`}>
        Add New Technical Component
      </Link>
    </div>
  );
};

export default TechnicalComponents;
