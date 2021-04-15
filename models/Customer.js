const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobile_phone: {
    type: String,
    required: true
  },
  office_phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  postal_code: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  avatar: {
    type: String
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

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
