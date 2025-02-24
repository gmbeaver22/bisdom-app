const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log("User created:", { email }); // Debug log
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error); // Debug log
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email); // Debug log

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email); // Debug log
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for:", email); // Debug log
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "secretkey", {
      expiresIn: "1h",
    });
    console.log("Login successful for:", email); // Debug log
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error); // Debug log
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
