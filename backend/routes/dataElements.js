const express = require("express");
const router = express.Router();
const DataElement = require("../models/DataElement");
const auth = require("../middleware/auth");

// GET /api/dataElements - Get all data elements (filtered by domain_id)
router.get("/", auth, async (req, res) => {
  try {
    const { domain_id } = req.query;
    const filter = domain_id ? { domain_id } : {};
    const dataElements = await DataElement.find(filter).populate(
      "consumed_by.applications consumed_by.capabilities consumed_by.use_cases"
    );
    res.json(dataElements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/dataElements/:id - Get a specific data element
router.get("/:id", auth, async (req, res) => {
  try {
    const dataElement = await DataElement.findById(req.params.id).populate(
      "consumed_by.applications consumed_by.capabilities consumed_by.use_cases"
    );
    if (!dataElement)
      return res.status(404).json({ msg: "Data element not found" });
    res.json(dataElement);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Data element not found" });
    res.status(500).send("Server Error");
  }
});

// POST /api/dataElements - Create a new data element
router.post("/", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    description,
    classification,
    quality_requirements,
    governance,
    consumed_by,
    lifecycle,
    type,
    stewarding_domain,
    access_requirements,
  } = req.body;

  try {
    const existingElement = await DataElement.findOne({ id, domain_id });
    if (existingElement)
      return res
        .status(400)
        .json({
          msg: "Data element with this ID already exists in the domain",
        });

    const dataElement = new DataElement({
      domain_id,
      id,
      name,
      description,
      classification,
      quality_requirements,
      governance,
      consumed_by,
      lifecycle,
      type,
      stewarding_domain,
      access_requirements,
    });

    await dataElement.save();
    res.status(201).json(dataElement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/dataElements/:id - Update a data element
router.put("/:id", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    description,
    classification,
    quality_requirements,
    governance,
    consumed_by,
    lifecycle,
    type,
    stewarding_domain,
    access_requirements,
  } = req.body;

  try {
    let dataElement = await DataElement.findById(req.params.id);
    if (!dataElement)
      return res.status(404).json({ msg: "Data element not found" });

    if (id && id !== dataElement.id) {
      const existingElement = await DataElement.findOne({ id, domain_id });
      if (existingElement)
        return res
          .status(400)
          .json({
            msg: "Data element with this ID already exists in the domain",
          });
    }

    dataElement.id = id || dataElement.id;
    dataElement.name = name || dataElement.name;
    dataElement.description = description || dataElement.description;
    dataElement.classification = classification || dataElement.classification;
    dataElement.quality_requirements =
      quality_requirements || dataElement.quality_requirements;
    dataElement.governance = governance || dataElement.governance;
    dataElement.consumed_by = consumed_by || dataElement.consumed_by;
    dataElement.lifecycle = lifecycle || dataElement.lifecycle;
    dataElement.type = type || dataElement.type;
    dataElement.stewarding_domain =
      stewarding_domain || dataElement.stewarding_domain;
    dataElement.access_requirements =
      access_requirements || dataElement.access_requirements;

    await dataElement.save();
    res.json(dataElement);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Data element not found" });
    res.status(500).send("Server Error");
  }
});

// DELETE /api/dataElements/:id - Delete a data element
router.delete("/:id", auth, async (req, res) => {
  try {
    const dataElement = await DataElement.findById(req.params.id);
    if (!dataElement)
      return res.status(404).json({ msg: "Data element not found" });

    await dataElement.remove();
    res.json({ msg: "Data element deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Data element not found" });
    res.status(500).send("Server Error");
  }
});

module.exports = router;
