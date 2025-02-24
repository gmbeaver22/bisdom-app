import React from "react";
import { Link } from "react-router-dom";

const DomainList = ({ domains }) => {
  return (
    <div className="domain-list">
      {domains.map((domain) => (
        <div key={domain._id} className="domain-card">
          <h3>{domain.name}</h3>
          <p>{domain.description}</p>
          <Link to={`/domains/${domain._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default DomainList;
