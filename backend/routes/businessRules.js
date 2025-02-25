const express = require("express");
const router = express.Router();
const BusinessRule = require("../models/BusinessRule");
const auth = require("../middleware/auth");

// GET /api/businessRules - Get all business rules (filtered by domain_id)
router.get("/", auth, async (req, res) => {
  try {
    const { domain_id } = req.query;
    const filter = domain_id ? { domain_id } : {};
    const rules = await BusinessRule.find(filter).populate(
      "applies_to_use_cases impact.kpis impact.use_cases"
    );
    res.json(rules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/businessRules/:id - Get a specific business rule
router.get("/:id", auth, async (req, res) => {
  try {
    const rule = await BusinessRule.findById(req.params.id).populate(
      "applies_to_use_cases impact.kpis impact.use_cases"
    );
    if (!rule) return res.status(404).json({ msg: "Business rule not found" });
    res.json(rule);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Business rule not found" });
    res.status(500).send("Server Error");
  }
});

// POST /api/businessRules - Create a new business rule
router.post("/", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    description,
    category,
    applies_to_use_cases,
    owner,
    gwt_format,
    validation,
    impact,
    exceptions,
  } = req.body;

  try {
    const existingRule = await BusinessRule.findOne({ id, domain_id });
    if (existingRule)
      return res
        .status(400)
        .json({
          msg: "Business rule with this ID already exists in the domain",
        });

    const rule = new BusinessRule({
      domain_id,
      id,
      name,
      description,
      category,
      applies_to_use_cases,
      owner,
      gwt_format,
      validation,
      impact,
      exceptions,
    });

    await rule.save();
    res.status(201).json(rule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/businessRules/:id - Update a business rule
router.put("/:id", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    description,
    category,
    applies_to_use_cases,
    owner,
    gwt_format,
    validation,
    impact,
    exceptions,
  } = req.body;

  try {
    let rule = await BusinessRule.findById(req.params.id);
    if (!rule) return res.status(404).json({ msg: "Business rule not found" });

    if (id && id !== rule.id) {
      const existingRule = await BusinessRule.findOne({ id, domain_id });
      if (existingRule)
        return res
          .status(400)
          .json({
            msg: "Business rule with this ID already exists in the domain",
          });
    }

    rule.id = id || rule.id;
    rule.name = name || rule.name;
    rule.description = description || rule.description;
    rule.category = category || rule.category;
    rule.applies_to_use_cases =
      applies_to_use_cases || rule.applies_to_use_cases;
    rule.owner = owner || rule.owner;
    rule.gwt_format = gwt_format || rule.gwt_format;
    rule.validation = validation || rule.validation;
    rule.impact = impact || rule.impact;
    rule.exceptions = exceptions || rule.exceptions;

    await rule.save();
    res.json(rule);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Business rule not found" });
    res.status(500).send("Server Error");
  }
});

// DELETE /api/businessRules/:id - Delete a business rule
router.delete("/:id", auth, async (req, res) => {
  try {
    const rule = await BusinessRule.findById(req.params.id);
    if (!rule) return res.status(404).json({ msg: "Business rule not found" });

    await rule.remove();
    res.json({ msg: "Business rule deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Business rule not found" });
    res.status(500).send("Server Error");
  }
});

module.exports = router;
