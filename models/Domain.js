const mongoose = require("mongoose");

const DomainSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    trim: true
  },
  subDomain: {
    type: String,
    required: true,
    trim: true
  },
  subjects: [
    {
      type: String, 
      required: true
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Domain", DomainSchema);
