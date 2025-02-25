const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  id: { type: String, unique: true, required: true }, // e.g., "APP001"
  name: { type: String, required: true },
  implements_capabilities: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Capability" },
  ],
  status: {
    type: String,
    enum: ["ACTIVE", "PLANNED", "RETIRING"],
    required: true,
  },
  version: { type: String, required: true },
  lifecycle: {
    implementation_date: { type: Date, required: true },
    sunset_date: Date,
  },
  dependencies: {
    data: [String], // IDs of required data assets
    technical_components: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TechnicalComponent" },
    ],
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
