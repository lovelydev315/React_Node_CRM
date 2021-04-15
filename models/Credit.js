const mongoose = require("mongoose");

const CreditSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  phases: [{
    phase: Number,
    name: String,
    stages: [{
      stage: Number,
      name: String
    }]
  }],
  user_state: {
    phase: Number,
    stage: Number
  },
  user_check: {
    type: Boolean
  },
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Credit = mongoose.model("Credit", CreditSchema);

module.exports = Credit;
