import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const KPIs = () => {
  const { domainId } = useParams();
  const { token } = useAuth();
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchKpis = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/kpis?domain_id=${domainId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setKpis(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch KPIs");
        setLoading(false);
      }
    };
    fetchKpis();
  }, [domainId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>KPIs for Domain</h2>
      <ul>
        {kpis.map((kpi) => (
          <li key={kpi._id}>
            {kpi.name} - Target: {kpi.target}, Current: {kpi.current_value}{" "}
            <Link to={`/domains/${domainId}/kpis/${kpi._id}/edit`}>Edit</Link>
          </li>
        ))}
      </ul>
      <Link to={`/domains/${domainId}/kpis/new`}>Add New KPI</Link>
    </div>
  );
};

export default KPIs;
