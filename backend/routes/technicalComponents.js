const express = require("express");
const router = express.Router();
const TechnicalComponent = require("../models/TechnicalComponent");
const auth = require("../middleware/auth");

// GET /api/technicalComponents - Get all technical components (filtered by domain_id)
router.get("/", auth, async (req, res) => {
  try {
    const { domain_id } = req.query;
    const filter = domain_id ? { domain_id } : {};
    const components = await TechnicalComponent.find(filter).populate(
      "supports_applications implements_capabilities"
    );
    res.json(components);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/technicalComponents/:id - Get a specific technical component
router.get("/:id", auth, async (req, res) => {
  try {
    const component = await TechnicalComponent.findById(req.params.id).populate(
      "supports_applications implements_capabilities"
    );
    if (!component)
      return res.status(404).json({ msg: "Technical component not found" });
    res.json(component);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Technical component not found" });
    res.status(500).send("Server Error");
  }
});

// POST /api/technicalComponents - Create a new technical component
router.post("/", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    type,
    supports_applications,
    implements_capabilities,
  } = req.body;

  try {
    const existingComponent = await TechnicalComponent.findOne({
      id,
      domain_id,
    });
    if (existingComponent)
      return res
        .status(400)
        .json({
          msg: "Technical component with this ID already exists in the domain",
        });

    const component = new TechnicalComponent({
      domain_id,
      id,
      name,
      type,
      supports_applications,
      implements_capabilities,
    });

    await component.save();
    res.status(201).json(component);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/technicalComponents/:id - Update a technical component
router.put("/:id", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    type,
    supports_applications,
    implements_capabilities,
  } = req.body;

  try {
    let component = await TechnicalComponent.findById(req.params.id);
    if (!component)
      return res.status(404).json({ msg: "Technical component not found" });

    if (id && id !== component.id) {
      const existingComponent = await TechnicalComponent.findOne({
        id,
        domain_id,
      });
      if (existingComponent)
        return res
          .status(400)
          .json({
            msg: "Technical component with this ID already exists in the domain",
          });
    }

    component.id = id || component.id;
    component.name = name || component.name;
    component.type = type || component.type;
    component.supports_applications =
      supports_applications || component.supports_applications;
    component.implements_capabilities =
      implements_capabilities || component.implements_capabilities;

    await component.save();
    res.json(component);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Technical component not found" });
    res.status(500).send("Server Error");
  }
});

// DELETE /api/technicalComponents/:id - Delete a technical component
router.delete("/:id", auth, async (req, res) => {
  try {
    const component = await TechnicalComponent.findById(req.params.id);
    if (!component)
      return res.status(404).json({ msg: "Technical component not found" });

    await component.remove();
    res.json({ msg: "Technical component deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Technical component not found" });
    res.status(500).send("Server Error");
  }
});

module.exports = router;
