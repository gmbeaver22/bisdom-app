import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";

const UseCases = () => {
  const { domainId } = useParams();
  const { token } = useContext(AuthContext);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUseCases = async () => {
      try {
        const res = await axios.get(`/api/useCases?domain_id=${domainId}`, {
          headers: { Authorization: token },
        });
        setUseCases(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch use cases");
        setLoading(false);
      }
    };
    fetchUseCases();
  }, [domainId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Use Cases for Domain</h2>
      <ul>
        {useCases.map((useCase) => (
          <li key={useCase._id}>
            {useCase.name} - {useCase.business_value}{" "}
            <Link to={`/domains/${domainId}/useCases/${useCase._id}/edit`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/domains/${domainId}/useCases/new`}>Add New Use Case</Link>
    </div>
  );
};

export default UseCases;
