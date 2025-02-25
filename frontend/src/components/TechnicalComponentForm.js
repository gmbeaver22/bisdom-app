import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import apiService from "../services/api";

const TechnicalComponentForm = () => {
  const { domainId, componentId } = useParams();
  const history = useHistory();
  const [component, setComponent] = useState({
    domain_id: domainId,
    id: "",
    name: "",
    type: "Microservice",
    supports_applications: [],
    implements_capabilities: [],
  });
  const [applications, setApplications] = useState([]);
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, capsRes] = await Promise.all([
          apiService.getApplications(domainId),
          apiService.getCapabilities(domainId),
        ]);
        setApplications(appsRes.data);
        setCapabilities(capsRes.data);
      } catch (err) {
        console.error("Failed to fetch related data", err);
      }
    };

    if (componentId) {
      apiService
        .getTechnicalComponent(componentId)
        .then((res) => setComponent(res.data))
        .catch((err) => console.error(err));
    }
    fetchData();
  }, [domainId, componentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComponent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (e, field) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setComponent((prev) => ({
      ...prev,
      [field]: selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (componentId) {
        await apiService.updateTechnicalComponent(componentId, component);
      } else {
        await apiService.createTechnicalComponent(component);
      }
      history.push(`/domains/${domainId}/technicalComponents`);
    } catch (err) {
      console.error("Failed to save technical component", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={component.id}
        onChange={handleChange}
        placeholder="Component ID"
        required
      />
      <input
        type="text"
        name="name"
        value={component.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <select name="type" value={component.type} onChange={handleChange}>
        <option value="Microservice">Microservice</option>
        <option value="Database">Database</option>
        <option value="API">API</option>
        <option value="Other">Other</option>
      </select>
      <label>Supports Applications:</label>
      <select
        multiple
        value={component.supports_applications}
        onChange={(e) => handleMultiSelectChange(e, "supports_applications")}
      >
        {applications.map((app) => (
          <option key={app._id} value={app._id}>
            {app.name}
          </option>
        ))}
      </select>
      <label>Implements Capabilities:</label>
      <select
        multiple
        value={component.implements_capabilities}
        onChange={(e) => handleMultiSelectChange(e, "implements_capabilities")}
      >
        {capabilities.map((cap) => (
          <option key={cap._id} value={cap._id}>
            {cap.name}
          </option>
        ))}
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default TechnicalComponentForm;
