import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import apiService from "../services/api";

const DataElementForm = () => {
  const { domainId, dataElementId } = useParams();
  const history = useHistory();
  const [dataElement, setDataElement] = useState({
    domain_id: domainId,
    id: "",
    name: "",
    description: "",
    classification: "Public",
    quality_requirements: [],
    governance: { owner: "", steward: "", policies: [] },
    consumed_by: { applications: [], capabilities: [], use_cases: [] },
    lifecycle: { creation: "", updates: "", archival: "" },
    type: "owned",
    stewarding_domain: "",
    access_requirements: [],
  });
  const [applications, setApplications] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [useCases, setUseCases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, capsRes, ucsRes] = await Promise.all([
          apiService.getApplications(domainId),
          apiService.getCapabilities(domainId),
          apiService.getUseCases(domainId),
        ]);
        setApplications(appsRes.data);
        setCapabilities(capsRes.data);
        setUseCases(ucsRes.data);
      } catch (err) {
        console.error("Failed to fetch related data", err);
      }
    };

    if (dataElementId) {
      apiService
        .getDataElement(dataElementId)
        .then((res) => setDataElement(res.data))
        .catch((err) => console.error(err));
    }
    fetchData();
  }, [domainId, dataElementId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataElement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, field) => {
    const array = e.target.value
      .split("\n")
      .filter((item) => item.trim() !== "");
    setDataElement((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const handleGovernanceChange = (e, subfield) => {
    const { value } = e.target;
    setDataElement((prev) => ({
      ...prev,
      governance: { ...prev.governance, [subfield]: value },
    }));
  };

  const handleLifecycleChange = (e, subfield) => {
    const { value } = e.target;
    setDataElement((prev) => ({
      ...prev,
      lifecycle: { ...prev.lifecycle, [subfield]: value },
    }));
  };

  const handleMultiSelectChange = (e, field) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setDataElement((prev) => ({
      ...prev,
      consumed_by: { ...prev.consumed_by, [field]: selected },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (dataElementId) {
        await apiService.updateDataElement(dataElementId, dataElement);
      } else {
        await apiService.createDataElement(dataElement);
      }
      history.push(`/domains/${domainId}/dataElements`);
    } catch (err) {
      console.error("Failed to save data element", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={dataElement.id}
        onChange={handleChange}
        placeholder="Data Element ID"
        required
      />
      <input
        type="text"
        name="name"
        value={dataElement.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="description"
        value={dataElement.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <select
        name="classification"
        value={dataElement.classification}
        onChange={handleChange}
      >
        <option value="Public">Public</option>
        <option value="Confidential">Confidential</option>
        <option value="PII">PII</option>
      </select>
      <label>Quality Requirements:</label>
      <textarea
        value={dataElement.quality_requirements.join("\n")}
        onChange={(e) => handleArrayChange(e, "quality_requirements")}
        placeholder="Enter requirements, one per line"
      />
      <input
        type="text"
        name="owner"
        value={dataElement.governance.owner}
        onChange={(e) => handleGovernanceChange(e, "owner")}
        placeholder="Owner"
      />
      <input
        type="text"
        name="steward"
        value={dataElement.governance.steward}
        onChange={(e) => handleGovernanceChange(e, "steward")}
        placeholder="Steward"
      />
      <label>Governance Policies:</label>
      <textarea
        value={dataElement.governance.policies.join("\n")}
        onChange={(e) => handleArrayChange(e, "governance.policies")}
        placeholder="Enter policies, one per line"
      />
      <label>Lifecycle Creation:</label>
      <input
        type="text"
        name="creation"
        value={dataElement.lifecycle.creation}
        onChange={(e) => handleLifecycleChange(e, "creation")}
        placeholder="Creation Process"
      />
      <label>Lifecycle Updates:</label>
      <input
        type="text"
        name="updates"
        value={dataElement.lifecycle.updates}
        onChange={(e) => handleLifecycleChange(e, "updates")}
        placeholder="Update Process"
      />
      <label>Lifecycle Archival:</label>
      <input
        type="text"
        name="archival"
        value={dataElement.lifecycle.archival}
        onChange={(e) => handleLifecycleChange(e, "archival")}
        placeholder="Archival Rules"
      />
      <select name="type" value={dataElement.type} onChange={handleChange}>
        <option value="owned">Owned</option>
        <option value="referenced">Referenced</option>
      </select>
      {dataElement.type === "referenced" && (
        <>
          <input
            type="text"
            name="stewarding_domain"
            value={dataElement.stewarding_domain}
            onChange={handleChange}
            placeholder="Stewarding Domain"
          />
          <label>Access Requirements:</label>
          <textarea
            value={dataElement.access_requirements.join("\n")}
            onChange={(e) => handleArrayChange(e, "access_requirements")}
            placeholder="Enter requirements, one per line"
          />
        </>
      )}
      <label>Consumed By Applications:</label>
      <select
        multiple
        value={dataElement.consumed_by.applications}
        onChange={(e) => handleMultiSelectChange(e, "applications")}
      >
        {applications.map((app) => (
          <option key={app._id} value={app._id}>
            {app.name}
          </option>
        ))}
      </select>
      <label>Consumed By Capabilities:</label>
      <select
        multiple
        value={dataElement.consumed_by.capabilities}
        onChange={(e) => handleMultiSelectChange(e, "capabilities")}
      >
        {capabilities.map((cap) => (
          <option key={cap._id} value={cap._id}>
            {cap.name}
          </option>
        ))}
      </select>
      <label>Consumed By Use Cases:</label>
      <select
        multiple
        value={dataElement.consumed_by.use_cases}
        onChange={(e) => handleMultiSelectChange(e, "use_cases")}
      >
        {useCases.map((uc) => (
          <option key={uc._id} value={uc._id}>
            {uc.name}
          </option>
        ))}
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default DataElementForm;
