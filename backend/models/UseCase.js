const UseCaseSchema = new mongoose.Schema({
  domain_id: { type: mongoose.Schema.Types.ObjectId, ref: "Domain" },
  use_case_id: { type: String, unique: true }, // e.g., "UC001"
  name: String,
  business_value: String,
  primary_actor: String,
  success_criteria: [String],
  measured_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "KPI" }], // References KPI _id
  required_capabilities: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Capability" },
  ], // References Capability _id
});
