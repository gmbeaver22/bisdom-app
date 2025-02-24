import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const CapabilityForm = () => {
  const { domainId, capabilityId } = useParams();
  const history = useHistory();
  const [capability, setCapability] = useState({
    domain_id: domainId,
    id: "",
    name: "",
    level: "",
    description: "",
    maturity: { current_level: 1, target_level: 1, assessment_date: "" },
    enables_use_cases: [],
  });
  const [useCases, setUseCases] = useState([]);

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        const res = await axios.get(`/api/domains/${domainId}/useCases`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setUseCases(res.data);
      } catch (err) {
        console.error("Failed to fetch use cases", err);
      }
    };
    fetchUseCases();

    if (capabilityId) {
      const fetchCapability = async () => {
        try {
          const res = await axios.get(`/api/capabilities/${capabilityId}`, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          setCapability(res.data);
        } catch (err) {
          console.error("Failed to fetch capability", err);
        }
      };
      fetchCapability();
    }
  }, [domainId, capabilityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCapability((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaturityChange = (e) => {
    const { name, value } = e.target;
    setCapability((prev) => ({
      ...prev,
      maturity: {
        ...prev.maturity,
        [name]: name === "assessment_date" ? value : parseInt(value) || value,
      },
    }));
  };

  const handleMultiSelectChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setCapability((prev) => ({ ...prev, enables_use_cases: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (capabilityId) {
        await axios.put(`/api/capabilities/${capabilityId}`, capability, {
          headers: { Authorization: localStorage.getItem("token") },
        });
      } else {
        await axios.post("/api/capabilities", capability, {
          headers: { Authorization: localStorage.getItem("token") },
        });
      }
      history.push(`/domains/${domainId}/capabilities`);
    } catch (err) {
      console.error("Failed to save capability", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={capability.id}
        onChange={handleChange}
        placeholder="Capability ID"
        required
      />
      <input
        type="text"
        name="name"
        value={capability.name}
        onChange={handleChange}
        placeholder="Capability Name"
        required
      />
      <select name="level" value={capability.level} onChange={handleChange}>
        <option value="">Select Level</option>
        <option value="L1">L1</option>
        <option value="L2">L2</option>
        <option value="L3">L3</option>
      </select>
      <textarea
        name="description"
        value={capability.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <h3>Maturity</h3>
      <input
        type="number"
        name="current_level"
        value={capability.maturity.current_level}
        onChange={handleMaturityChange}
        min="1"
        max="5"
      />
      <input
        type="number"
        name="target_level"
        value={capability.maturity.target_level}
        onChange={handleMaturityChange}
        min="1"
        max="5"
      />
      <input
        type="date"
        name="assessment_date"
        value={capability.maturity.assessment_date.split("T")[0] || ""}
        onChange={handleMaturityChange}
      />
      <label>
        Enables Use Cases:
        <select
          multiple
          value={capability.enables_use_cases}
          onChange={handleMultiSelectChange}
        >
          {useCases.map((uc) => (
            <option key={uc._id} value={uc._id}>
              {uc.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default CapabilityForm;
