import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const KPIForm = () => {
  const { domainId, kpiId } = useParams();
  const history = useHistory();
  const [kpi, setKpi] = useState({
    domain_id: domainId,
    id: "",
    name: "",
    target: "",
    current_value: "",
    measurement_frequency: "",
    trend: "",
    related_strategic_goals: [],
  });
  const [strategicGoals, setStrategicGoals] = useState([]);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await axios.get(`/api/domains/${domainId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setStrategicGoals(res.data.leadership.strategic_goals);
      } catch (err) {
        console.error("Failed to fetch domain", err);
      }
    };
    fetchDomain();

    if (kpiId) {
      const fetchKPI = async () => {
        try {
          const res = await axios.get(`/api/kpis/${kpiId}`, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          setKpi(res.data);
        } catch (err) {
          console.error("Failed to fetch KPI", err);
        }
      };
      fetchKPI();
    }
  }, [domainId, kpiId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKpi((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setKpi((prev) => ({ ...prev, related_strategic_goals: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (kpiId) {
        await axios.put(`/api/kpis/${kpiId}`, kpi, {
          headers: { Authorization: localStorage.getItem("token") },
        });
      } else {
        await axios.post("/api/kpis", kpi, {
          headers: { Authorization: localStorage.getItem("token") },
        });
      }
      history.push(`/domains/${domainId}/kpis`);
    } catch (err) {
      console.error("Failed to save KPI", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={kpi.id}
        onChange={handleChange}
        placeholder="KPI ID"
        required
      />
      <input
        type="text"
        name="name"
        value={kpi.name}
        onChange={handleChange}
        placeholder="KPI Name"
        required
      />
      <input
        type="text"
        name="target"
        value={kpi.target}
        onChange={handleChange}
        placeholder="Target"
      />
      <input
        type="text"
        name="current_value"
        value={kpi.current_value}
        onChange={handleChange}
        placeholder="Current Value"
      />
      <select
        name="measurement_frequency"
        value={kpi.measurement_frequency}
        onChange={handleChange}
      >
        <option value="">Select Frequency</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
      </select>
      <select name="trend" value={kpi.trend} onChange={handleChange}>
        <option value="">Select Trend</option>
        <option value="Up">Up</option>
        <option value="Down">Down</option>
        <option value="Stable">Stable</option>
      </select>
      <label>
        Related Strategic Goals:
        <select
          multiple
          value={kpi.related_strategic_goals}
          onChange={handleMultiSelectChange}
        >
          {strategicGoals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.description}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default KPIForm;
