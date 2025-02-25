const mongoose = require("mongoose");

const UseCaseSchema = new mongoose.Schema({
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  business_value: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["planned", "in-progress", "completed"],
    default: "planned",
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  capabilities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Capability",
    },
  ],
  kpis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KPI",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the updated_at timestamp before saving
UseCaseSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("UseCase", UseCaseSchema);
