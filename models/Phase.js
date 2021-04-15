const mongoose = require("mongoose");

const PhaseSchema = new mongoose.Schema({
  phase: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  stages: [{
    stage: Number,
    name: String
  }]
});

const Phase = mongoose.model("Phase", PhaseSchema);

module.exports = Phase;
