const express = require("express");
const router = express.Router();
const KPI = require("../models/KPI");
const auth = require("../middleware/auth");

// @route   GET /api/kpis
// @desc    Get all KPIs (optionally filtered by domain_id)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { domain_id } = req.query;
    const filter = domain_id ? { domain_id } : {};
    const kpis = await KPI.find(filter);
    res.json(kpis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/kpis/:id
// @desc    Get a specific KPI by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const kpi = await KPI.findById(req.params.id);
    if (!kpi) {
      return res.status(404).json({ msg: "KPI not found" });
    }
    res.json(kpi);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "KPI not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/kpis
// @desc    Create a new KPI
// @access  Private
router.post("/", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    target,
    current_value,
    measurement_frequency,
    trend,
    related_strategic_goals,
  } = req.body;

  try {
    // Check if KPI with the same custom 'id' already exists in the domain
    const existingKPI = await KPI.findOne({ id, domain_id });
    if (existingKPI) {
      return res
        .status(400)
        .json({ msg: "KPI with this ID already exists in the domain" });
    }

    const kpi = new KPI({
      domain_id,
      id, // Custom identifier (e.g., "KPI001")
      name,
      target,
      current_value,
      measurement_frequency,
      trend,
      related_strategic_goals,
    });

    await kpi.save();
    res.status(201).json(kpi);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/kpis/:id
// @desc    Update an existing KPI
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    target,
    current_value,
    measurement_frequency,
    trend,
    related_strategic_goals,
  } = req.body;

  try {
    const kpi = await KPI.findById(req.params.id);
    if (!kpi) {
      return res.status(404).json({ msg: "KPI not found" });
    }

    // Check if updating the custom 'id' would cause a duplicate
    if (id && id !== kpi.id) {
      const existingKPI = await KPI.findOne({ id, domain_id });
      if (existingKPI) {
        return res
          .status(400)
          .json({ msg: "KPI with this ID already exists in the domain" });
      }
    }

    // Update fields
    kpi.domain_id = domain_id || kpi.domain_id;
    kpi.id = id || kpi.id;
    kpi.name = name || kpi.name;
    kpi.target = target || kpi.target;
    kpi.current_value = current_value || kpi.current_value;
    kpi.measurement_frequency =
      measurement_frequency || kpi.measurement_frequency;
    kpi.trend = trend || kpi.trend;
    kpi.related_strategic_goals =
      related_strategic_goals || kpi.related_strategic_goals;

    await kpi.save();
    res.json(kpi);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "KPI not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/kpis/:id
// @desc    Delete a KPI
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const kpi = await KPI.findById(req.params.id);
    if (!kpi) {
      return res.status(404).json({ msg: "KPI not found" });
    }

    await kpi.remove();
    res.json({ msg: "KPI deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "KPI not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
