const express = require("express");
const router = express.Router();
const Capability = require("../models/Capability");
const auth = require("../middleware/auth");

// @route   GET /api/capabilities
// @desc    Get all capabilities (optionally filtered by domain_id)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { domain_id } = req.query;
    const filter = domain_id ? { domain_id } : {};
    const capabilities = await Capability.find(filter);
    res.json(capabilities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/capabilities/:id
// @desc    Get a specific capability by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const capability = await Capability.findById(req.params.id);
    if (!capability) {
      return res.status(404).json({ msg: "Capability not found" });
    }
    res.json(capability);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Capability not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/capabilities
// @desc    Create a new capability
// @access  Private
router.post("/", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    level,
    description,
    maturity,
    enables_use_cases,
    required_data,
    implemented_by,
  } = req.body;

  try {
    // Check if capability with the same custom 'id' already exists in the domain
    const existingCapability = await Capability.findOne({ id, domain_id });
    if (existingCapability) {
      return res
        .status(400)
        .json({ msg: "Capability with this ID already exists in the domain" });
    }

    const capability = new Capability({
      domain_id,
      id, // Custom identifier (e.g., "CAP001")
      name,
      level,
      description,
      maturity,
      enables_use_cases,
      required_data,
      implemented_by,
    });

    await capability.save();
    res.status(201).json(capability);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/capabilities/:id
// @desc    Update an existing capability
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    level,
    description,
    maturity,
    enables_use_cases,
    required_data,
    implemented_by,
  } = req.body;

  try {
    const capability = await Capability.findById(req.params.id);
    if (!capability) {
      return res.status(404).json({ msg: "Capability not found" });
    }

    // Check if updating the custom 'id' would cause a duplicate
    if (id && id !== capability.id) {
      const existingCapability = await Capability.findOne({ id, domain_id });
      if (existingCapability) {
        return res
          .status(400)
          .json({
            msg: "Capability with this ID already exists in the domain",
          });
      }
    }

    // Update fields
    capability.domain_id = domain_id || capability.domain_id;
    capability.id = id || capability.id;
    capability.name = name || capability.name;
    capability.level = level || capability.level;
    capability.description = description || capability.description;
    capability.maturity = maturity || capability.maturity;
    capability.enables_use_cases =
      enables_use_cases || capability.enables_use_cases;
    capability.required_data = required_data || capability.required_data;
    capability.implemented_by = implemented_by || capability.implemented_by;

    await capability.save();
    res.json(capability);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Capability not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/capabilities/:id
// @desc    Delete a capability
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const capability = await Capability.findById(req.params.id);
    if (!capability) {
      return res.status(404).json({ msg: "Capability not found" });
    }

    await capability.remove();
    res.json({ msg: "Capability deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Capability not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
