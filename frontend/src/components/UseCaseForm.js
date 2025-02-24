import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const UseCaseForm = () => {
  const { domainId, useCaseId } = useParams();
  const history = useHistory();
  const [useCase, setUseCase] = useState({
    domain_id: domainId,
    id: "",
    name: "",
    business_value: "",
    primary_actor: "",
    success_criteria: [],
    measured_by: [], // KPIs
    required_capabilities: [], // Capabilities
  });
  const [kpis, setKpis] = useState([]);
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    const fetchKpisAndCapabilities = async () => {
      try {
        const [kpiRes, capRes] = await Promise.all([
          axios.get(`/api/domains/${domainId}/kpis`, {
            headers: { Authorization: localStorage.getItem("token") },
          }),
          axios.get(`/api/domains/${domainId}/capabilities`, {
            headers: { Authorization: localStorage.getItem("token") },
          }),
        ]);
        setKpis(kpiRes.data);
        setCapabilities(capRes.data);
      } catch (err) {
        console.error("Failed to fetch KPIs and capabilities", err);
      }
    };
    fetchKpisAndCapabilities();

    if (useCaseId) {
      const fetchUseCase = async () => {
        try {
          const res = await axios.get(`/api/useCases/${useCaseId}`, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          setUseCase(res.data);
        } catch (err) {
          console.error("Failed to fetch use case", err);
        }
      };
      fetchUseCase();
    }
  }, [domainId, useCaseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUseCase((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuccessCriteriaChange = (e) => {
    const criteria = e.target.value.split("\n").filter((c) => c.trim() !== "");
    setUseCase((prev) => ({ ...prev, success_criteria: criteria }));
  };

  const handleMultiSelectChange = (e, field) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setUseCase((prev) => ({ ...prev, [field]: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (useCaseId) {
        await axios.put(`/api/useCases/${useCaseId}`, useCase, {
          headers: { Authorization: localStorage.getItem("token") },
        });
      } else {
        await axios.post("/api/useCases", useCase, {
          headers: { Authorization: localStorage.getItem("token") },
        });
      }
      history.push(`/domains/${domainId}/useCases`);
    } catch (err) {
      console.error("Failed to save use case", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={useCase.id}
        onChange={handleChange}
        placeholder="Use Case ID"
        required
      />
      <input
        type="text"
        name="name"
        value={useCase.name}
        onChange={handleChange}
        placeholder="Use Case Name"
        required
      />
      <textarea
        name="business_value"
        value={useCase.business_value}
        onChange={handleChange}
        placeholder="Business Value"
      />
      <input
        type="text"
        name="primary_actor"
        value={useCase.primary_actor}
        onChange={handleChange}
        placeholder="Primary Actor"
      />
      <label>
        Success Criteria:
        <textarea
          value={useCase.success_criteria.join("\n")}
          onChange={handleSuccessCriteriaChange}
          placeholder="Enter each criterion on a new line"
        />
      </label>
      <label>
        Measured By (KPIs):
        <select
          multiple
          value={useCase.measured_by}
          onChange={(e) => handleMultiSelectChange(e, "measured_by")}
        >
          {kpis.map((kpi) => (
            <option key={kpi._id} value={kpi._id}>
              {kpi.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Required Capabilities:
        <select
          multiple
          value={useCase.required_capabilities}
          onChange={(e) => handleMultiSelectChange(e, "required_capabilities")}
        >
          {capabilities.map((cap) => (
            <option key={cap._id} value={cap._id}>
              {cap.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default UseCaseForm;
