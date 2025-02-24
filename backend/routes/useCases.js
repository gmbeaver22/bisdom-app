const express = require("express");
const router = express.Router();
const UseCase = require("../models/UseCase");
const auth = require("../middleware/auth");

// @route   GET /api/useCases
// @desc    Get all use cases (optionally filtered by domain_id)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { domain_id } = req.query;
    const filter = domain_id ? { domain_id } : {};
    const useCases = await UseCase.find(filter)
      .populate("measured_by")
      .populate("required_capabilities");
    res.json(useCases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/useCases/:id
// @desc    Get a specific use case by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const useCase = await UseCase.findById(req.params.id)
      .populate("measured_by")
      .populate("required_capabilities");
    if (!useCase) {
      return res.status(404).json({ msg: "Use case not found" });
    }
    res.json(useCase);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Use case not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/useCases
// @desc    Create a new use case
// @access  Private
router.post("/", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    business_value,
    primary_actor,
    success_criteria,
    measured_by,
    required_capabilities,
  } = req.body;

  try {
    // Check if use case with the same custom 'id' already exists in the domain
    const existingUseCase = await UseCase.findOne({ id, domain_id });
    if (existingUseCase) {
      return res
        .status(400)
        .json({ msg: "Use case with this ID already exists in the domain" });
    }

    const useCase = new UseCase({
      domain_id,
      id, // Custom identifier (e.g., "UC001")
      name,
      business_value,
      primary_actor,
      success_criteria,
      measured_by,
      required_capabilities,
    });

    await useCase.save();
    res.status(201).json(useCase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/useCases/:id
// @desc    Update an existing use case
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    business_value,
    primary_actor,
    success_criteria,
    measured_by,
    required_capabilities,
  } = req.body;

  try {
    const useCase = await UseCase.findById(req.params.id);
    if (!useCase) {
      return res.status(404).json({ msg: "Use case not found" });
    }

    // Check if updating the custom 'id' would cause a duplicate
    if (id && id !== useCase.id) {
      const existingUseCase = await UseCase.findOne({ id, domain_id });
      if (existingUseCase) {
        return res
          .status(400)
          .json({ msg: "Use case with this ID already exists in the domain" });
      }
    }

    // Update fields
    useCase.domain_id = domain_id || useCase.domain_id;
    useCase.id = id || useCase.id;
    useCase.name = name || useCase.name;
    useCase.business_value = business_value || useCase.business_value;
    useCase.primary_actor = primary_actor || useCase.primary_actor;
    useCase.success_criteria = success_criteria || useCase.success_criteria;
    useCase.measured_by = measured_by || useCase.measured_by;
    useCase.required_capabilities =
      required_capabilities || useCase.required_capabilities;

    await useCase.save();
    res.json(useCase);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Use case not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/useCases/:id
// @desc    Delete a use case
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const useCase = await UseCase.findById(req.params.id);
    if (!useCase) {
      return res.status(404).json({ msg: "Use case not found" });
    }

    await useCase.remove();
    res.json({ msg: "Use case deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Use case not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
