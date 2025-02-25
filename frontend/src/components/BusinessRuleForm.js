import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import apiService from "../services/api";

const BusinessRuleForm = () => {
  const { domainId, ruleId } = useParams();
  const history = useHistory();
  const [rule, setRule] = useState({
    domain_id: domainId,
    id: "",
    name: "",
    description: "",
    category: "",
    applies_to_use_cases: [],
    owner: "",
    gwt_format: { given: [], when: [], then: [] },
    validation: [],
    impact: { kpis: [], use_cases: [] },
    exceptions: [],
  });
  const [useCases, setUseCases] = useState([]);
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ucRes, kpiRes] = await Promise.all([
          apiService.getUseCases(domainId),
          apiService.getKPIs(domainId),
        ]);
        setUseCases(ucRes.data);
        setKpis(kpiRes.data);
      } catch (err) {
        console.error("Failed to fetch related data", err);
      }
    };

    if (ruleId) {
      apiService
        .getBusinessRule(ruleId)
        .then((res) => setRule(res.data))
        .catch((err) => console.error(err));
    }
    fetchData();
  }, [domainId, ruleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRule((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const array = e.target.value
      .split("\n")
      .filter((item) => item.trim() !== "");
    setRule((prev) => ({ ...prev, [field]: array }));
  };

  const handleMultiSelectChange = (e, field) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setRule((prev) => ({
      ...prev,
      [field]: selected,
    }));
  };

  const handleGWTChange = (e, section) => {
    const array = e.target.value
      .split("\n")
      .filter((item) => item.trim() !== "");
    setRule((prev) => ({
      ...prev,
      gwt_format: { ...prev.gwt_format, [section]: array },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (ruleId) {
        await apiService.updateBusinessRule(ruleId, rule);
      } else {
        await apiService.createBusinessRule(rule);
      }
      history.push(`/domains/${domainId}/businessRules`);
    } catch (err) {
      console.error("Failed to save business rule", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={rule.id}
        onChange={handleChange}
        placeholder="Rule ID"
        required
      />
      <input
        type="text"
        name="name"
        value={rule.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="description"
        value={rule.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="text"
        name="category"
        value={rule.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />
      <input
        type="text"
        name="owner"
        value={rule.owner}
        onChange={handleChange}
        placeholder="Owner"
        required
      />
      <label>Applies To Use Cases:</label>
      <select
        multiple
        value={rule.applies_to_use_cases}
        onChange={(e) => handleMultiSelectChange(e, "applies_to_use_cases")}
      >
        {useCases.map((uc) => (
          <option key={uc._id} value={uc._id}>
            {uc.name}
          </option>
        ))}
      </select>
      <label>Given (GWT):</label>
      <textarea
        value={rule.gwt_format.given.join("\n")}
        onChange={(e) => handleGWTChange(e, "given")}
        placeholder="Enter preconditions, one per line"
      />
      <label>When (GWT):</label>
      <textarea
        value={rule.gwt_format.when.join("\n")}
        onChange={(e) => handleGWTChange(e, "when")}
        placeholder="Enter trigger conditions, one per line"
      />
      <label>Then (GWT):</label>
      <textarea
        value={rule.gwt_format.then.join("\n")}
        onChange={(e) => handleGWTChange(e, "then")}
        placeholder="Enter outcomes, one per line"
      />
      <label>Validation:</label>
      <textarea
        value={rule.validation.join("\n")}
        onChange={(e) => handleArrayChange(e, "validation")}
        placeholder="Enter validation steps, one per line"
      />
      <label>Impact KPIs:</label>
      <select
        multiple
        value={rule.impact.kpis}
        onChange={(e) => handleMultiSelectChange(e, "impact.kpis")}
      >
        {kpis.map((kpi) => (
          <option key={kpi._id} value={kpi._id}>
            {kpi.name}
          </option>
        ))}
      </select>
      <label>Impact Use Cases:</label>
      <select
        multiple
        value={rule.impact.use_cases}
        onChange={(e) => handleMultiSelectChange(e, "impact.use_cases")}
      >
        {useCases.map((uc) => (
          <option key={uc._id} value={uc._id}>
            {uc.name}
          </option>
        ))}
      </select>
      <label>Exceptions (Condition:Handling, one per line):</label>
      <textarea
        value={rule.exceptions
          .map((e) => `${e.condition}:${e.handling}`)
          .join("\n")}
        onChange={(e) =>
          setRule((prev) => ({
            ...prev,
            exceptions: e.target.value
              .split("\n")
              .map((line) => ({
                condition: line.split(":")[0],
                handling: line.split(":")[1] || "",
              })),
          }))
        }
        placeholder="Enter condition:handling pairs, one per line"
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default BusinessRuleForm;
