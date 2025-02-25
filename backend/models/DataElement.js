const mongoose = require("mongoose");

const DataElementSchema = new mongoose.Schema({
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  id: { type: String, unique: true, required: true }, // e.g., "DATA001"
  name: { type: String, required: true },
  description: { type: String },
  classification: {
    type: String,
    enum: ["PII", "Confidential", "Public"],
    required: true,
  },
  quality_requirements: [String],
  governance: {
    owner: { type: String, required: true },
    steward: { type: String, required: true },
    policies: [String],
  },
  consumed_by: {
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    ],
    capabilities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Capability" }],
    use_cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "UseCase" }],
  },
  lifecycle: {
    creation: String,
    updates: String,
    archival: String,
  },
  type: { type: String, enum: ["owned", "referenced"], required: true }, // To distinguish owned vs. referenced
  stewarding_domain: { type: String }, // For referenced data only
  access_requirements: [String], // For referenced data only
});

module.exports = mongoose.model("DataElement", DataElementSchema);
