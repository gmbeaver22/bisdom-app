const mongoose = require("mongoose");

const KPISchema = new mongoose.Schema({
  domain_id: { type: mongoose.Schema.Types.ObjectId, ref: "Domain" },
  kpi_id: { type: String, unique: true }, // e.g., "KPI001"
  name: String,
  target: String,
  current_value: String,
  measurement_frequency: String, // e.g., "Daily", "Monthly"
  trend: String, // e.g., "Up", "Down", "Stable"
  related_strategic_goals: [String], // IDs of strategic goals from the domain
});

module.exports = mongoose.model("KPI", KPISchema);
