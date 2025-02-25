const mongoose = require("mongoose");

const TechnicalComponentSchema = new mongoose.Schema({
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  id: { type: String, unique: true, required: true }, // e.g., "COMP001"
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Microservice", "Database", "API", "Other"],
    required: true,
  },
  supports_applications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  ],
  implements_capabilities: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Capability" },
  ],
});

module.exports = mongoose.model("TechnicalComponent", TechnicalComponentSchema);
