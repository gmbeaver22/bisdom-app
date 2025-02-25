const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const auth = require("../middleware/auth");

// GET /api/applications - Get all applications (filtered by domain_id)
router.get("/", auth, async (req, res) => {
  try {
    const { domain_id } = req.query;
    const filter = domain_id ? { domain_id } : {};
    const applications = await Application.find(filter).populate(
      "implements_capabilities technical_components"
    );
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/applications/:id - Get a specific application
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "implements_capabilities technical_components"
    );
    if (!application)
      return res.status(404).json({ msg: "Application not found" });
    res.json(application);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Application not found" });
    res.status(500).send("Server Error");
  }
});

// POST /api/applications - Create a new application
router.post("/", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    implements_capabilities,
    status,
    version,
    lifecycle,
    dependencies,
  } = req.body;

  try {
    const existingApp = await Application.findOne({ id, domain_id });
    if (existingApp)
      return res
        .status(400)
        .json({ msg: "Application with this ID already exists in the domain" });

    const application = new Application({
      domain_id,
      id,
      name,
      implements_capabilities,
      status,
      version,
      lifecycle,
      dependencies,
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/applications/:id - Update an application
router.put("/:id", auth, async (req, res) => {
  const {
    domain_id,
    id,
    name,
    implements_capabilities,
    status,
    version,
    lifecycle,
    dependencies,
  } = req.body;

  try {
    let application = await Application.findById(req.params.id);
    if (!application)
      return res.status(404).json({ msg: "Application not found" });

    if (id && id !== application.id) {
      const existingApp = await Application.findOne({ id, domain_id });
      if (existingApp)
        return res
          .status(400)
          .json({
            msg: "Application with this ID already exists in the domain",
          });
    }

    application.id = id || application.id;
    application.name = name || application.name;
    application.implements_capabilities =
      implements_capabilities || application.implements_capabilities;
    application.status = status || application.status;
    application.version = version || application.version;
    application.lifecycle = lifecycle || application.lifecycle;
    application.dependencies = dependencies || application.dependencies;

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Application not found" });
    res.status(500).send("Server Error");
  }
});

// DELETE /api/applications/:id - Delete an application
router.delete("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application)
      return res.status(404).json({ msg: "Application not found" });

    await application.remove();
    res.json({ msg: "Application deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Application not found" });
    res.status(500).send("Server Error");
  }
});

module.exports = router;
