const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const domainRoutes = require("./routes/domains");
const kpiRoutes = require("./routes/kpis");
// const useCaseRoutes = require("./routes/use-cases");
const capabilityRoutes = require("./routes/capabilities");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/bisdom")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/kpis", kpiRoutes);
// app.use("/api/use-cases", useCaseRoutes);
app.use("/api/capabilities", capabilityRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
