const mongoose = require("mongoose");

const BusinessRuleSchema = new mongoose.Schema({
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  id: { type: String, unique: true, required: true }, // e.g., "BR001"
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  applies_to_use_cases: [
    { type: mongoose.Schema.Types.ObjectId, ref: "UseCase" },
  ],
  owner: { type: String, required: true },
  gwt_format: {
    given: [String],
    when: [String],
    then: [String],
  },
  validation: [String],
  impact: {
    kpis: [{ type: mongoose.Schema.Types.ObjectId, ref: "KPI" }],
    use_cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "UseCase" }],
  },
  exceptions: [
    {
      condition: String,
      handling: String,
    },
  ],
});

module.exports = mongoose.model("BusinessRule", BusinessRuleSchema);
