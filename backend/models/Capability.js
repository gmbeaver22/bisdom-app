const mongoose = require("mongoose");

const CapabilitySchema = new mongoose.Schema({
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  id: { type: String, unique: true, required: true }, // e.g., "CAP001"
  name: { type: String, required: true },
  level: { type: String, enum: ["L1", "L2", "L3"], required: true },
  description: { type: String, required: true },
  enables_use_cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "UseCase" }],
  maturity: {
    current_level: { type: Number, min: 1, max: 5, required: true },
    target_level: { type: Number, min: 1, max: 5, required: true },
    assessment_date: { type: Date, required: true },
  },
  required_data: [{ type: mongoose.Schema.Types.ObjectId, ref: "DataElement" }],
  implemented_by: {
    primary_app: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    supporting_apps: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    ],
  },
});

module.exports = mongoose.model("Capability", CapabilitySchema);
