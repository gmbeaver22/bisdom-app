const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/domains", require("./routes/domains"));
app.use("/api/kpis", require("./routes/kpis"));
app.use("/api/useCases", require("./routes/useCases"));
app.use("/api/capabilities", require("./routes/capabilities"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/businessRules", require("./routes/businessRules"));
app.use("/api/dataElements", require("./routes/dataElements"));
app.use("/api/technicalComponents", require("./routes/technicalComponents"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
