const mongoose = require('mongoose');

const Services = mongoose.model("Services", new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  denominations: { type: String },
  type: { type: String, required: true },
  coinname: String,
  cryptoAddress: { type: String },
  rate: { type: String },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }))

module.exports = Services;