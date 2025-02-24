const express = require("express");
const router = express.Router();
const Domain = require("../models/domain");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secretkey");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

// Get all domains
router.get("/", auth, async (req, res) => {
  try {
    const domains = await Domain.find();
    res.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
    res.status(500).json({ error: "Error fetching domains" });
  }
});

// Create new domain
router.post("/new", auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const domain = new Domain({
      name,
      description,
      createdBy: req.userId,
    });
    await domain.save();
    res.status(201).json(domain);
  } catch (error) {
    console.error("Error creating domain:", error);
    res.status(500).json({ error: "Error creating domain" });
  }
});

// Get a domain
router.get("/:id", auth, async (req, res) => {
  const domain = await Domain.findById(req.params.id);
  if (!domain) return res.status(404).send("Domain not found");
  res.json(domain);
});

// Update a domain
router.put("/:id", auth, async (req, res) => {
  try {
    const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!domain) {
      return res.status(404).json({ error: "Domain not found" });
    }
    res.json(domain);
  } catch (error) {
    console.error("Error updating domain:", error);
    res.status(500).json({ error: "Error updating domain" });
  }
});

// Delete a domain
router.delete("/:id", auth, async (req, res) => {
  await Domain.findByIdAndDelete(req.params.id);
  res.send("Domain deleted");
});

module.exports = router;
