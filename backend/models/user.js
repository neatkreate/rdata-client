
// User model using MongoDB (Mongoose)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  wallet: { type: Number, default: 0 },
  todaysSpent: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  paid: { type: Boolean, default: false },
  renewalDate: { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
