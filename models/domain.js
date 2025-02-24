const mongoose = require("mongoose");

const DomainSchema = new mongoose.Schema({
  // ... existing schema definition ...
});

module.exports = mongoose.model("Domain", DomainSchema);
