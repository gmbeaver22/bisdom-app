import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const DataElements = () => {
  const { domainId } = useParams();
  const { token } = useAuth();
  const [dataElements, setDataElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchDataElements = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/dataElements?domain_id=${domainId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDataElements(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data elements:", err);
        setError("Failed to fetch data elements");
        setLoading(false);
      }
    };
    fetchDataElements();
  }, [domainId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Data Elements for Domain</h2>
      <ul>
        {dataElements.map((element) => (
          <li key={element._id}>
            {element.name} - Type: {element.type}{" "}
            <Link to={`/domains/${domainId}/dataElements/${element._id}/edit`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/domains/${domainId}/dataElements/new`}>
        Add New Data Element
      </Link>
    </div>
  );
};

export default DataElements;
