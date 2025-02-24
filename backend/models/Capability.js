const mongoose = require("mongoose");

const CapabilitySchema = new mongoose.Schema({
  domain_id: { type: mongoose.Schema.Types.ObjectId, ref: "Domain" },
  capability_id: { type: String, unique: true }, // e.g., "CAP001"
  name: String,
  level: String, // e.g., "L1", "L2"
  description: String,
  enables_use_cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "UseCase" }], // References UseCase _id
  maturity: {
    current_level: Number, // 1-5
    target_level: Number, // 1-5
    assessment_date: Date,
  },
  required_data: [String], // Placeholder for Data IDs (Phase 2)
  implemented_by: {
    primary_app: String, // Placeholder for App ID (Phase 2)
    supporting_apps: [String], // Placeholder for App IDs (Phase 2)
  },
});

module.exports = mongoose.model("Capability", CapabilitySchema);
