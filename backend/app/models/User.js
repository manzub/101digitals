const mongoose = require('mongoose');

const User = mongoose.model("User", new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: Number, default: 3 },
  bankInfo: { type: Object, default: { accountNo: null, accountName: null, bank: null, accountType: null } },
  transactions: [ { type: Object } ],
  notifications: [ { type: Object } ]
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }))

module.exports = User;