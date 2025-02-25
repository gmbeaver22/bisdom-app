import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import apiService from "../services/api";

const ApplicationForm = () => {
  const { domainId, applicationId } = useParams();
  const history = useHistory();
  const [application, setApplication] = useState({
    domain_id: domainId,
    id: "",
    name: "",
    implements_capabilities: [],
    status: "ACTIVE",
    version: "",
    lifecycle: { implementation_date: "", sunset_date: "" },
    dependencies: { data: [], technical_components: [] },
  });
  const [capabilities, setCapabilities] = useState([]);
  const [technicalComponents, setTechnicalComponents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [capsRes, compsRes] = await Promise.all([
          apiService.getCapabilities(domainId),
          apiService.getCapabilities(domainId), // Note: Should be getTechnicalComponents
        ]);
        setCapabilities(capsRes.data);
        setTechnicalComponents(compsRes.data); // Adjust to correct endpoint
      } catch (err) {
        console.error("Failed to fetch related data", err);
      }
    };

    if (applicationId) {
      apiService
        .getApplication(applicationId)
        .then((res) => setApplication(res.data))
        .catch((err) => console.error(err));
    }
    fetchData();
  }, [domainId, applicationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLifecycleChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({
      ...prev,
      lifecycle: { ...prev.lifecycle, [name]: value },
    }));
  };

  const handleMultiSelectChange = (e, field) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setApplication((prev) => ({
      ...prev,
      [field]: selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (applicationId) {
        await apiService.updateApplication(applicationId, application);
      } else {
        await apiService.createApplication(application);
      }
      history.push(`/domains/${domainId}/applications`);
    } catch (err) {
      console.error("Failed to save application", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={application.id}
        onChange={handleChange}
        placeholder="Application ID"
        required
      />
      <input
        type="text"
        name="name"
        value={application.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <select name="status" value={application.status} onChange={handleChange}>
        <option value="ACTIVE">ACTIVE</option>
        <option value="PLANNED">PLANNED</option>
        <option value="RETIRING">RETIRING</option>
      </select>
      <input
        type="text"
        name="version"
        value={application.version}
        onChange={handleChange}
        placeholder="Version"
        required
      />
      <input
        type="date"
        name="implementation_date"
        value={application.lifecycle.implementation_date}
        onChange={handleLifecycleChange}
        required
      />
      <input
        type="date"
        name="sunset_date"
        value={application.lifecycle.sunset_date || ""}
        onChange={handleLifecycleChange}
      />
      <label>Implements Capabilities:</label>
      <select
        multiple
        value={application.implements_capabilities}
        onChange={(e) => handleMultiSelectChange(e, "implements_capabilities")}
      >
        {capabilities.map((cap) => (
          <option key={cap._id} value={cap._id}>
            {cap.name}
          </option>
        ))}
      </select>
      <label>Depends on Technical Components:</label>
      <select
        multiple
        value={application.dependencies.technical_components}
        onChange={(e) =>
          handleMultiSelectChange(e, "dependencies.technical_components")
        }
      >
        {technicalComponents.map((comp) => (
          <option key={comp._id} value={comp._id}>
            {comp.name}
          </option>
        ))}
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default ApplicationForm;
