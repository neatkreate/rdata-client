
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
    saveUsers(users);
  }
  return admin;
}

// Call on module load
ensureDefaultAdmin();

// Helper to get admin credentials (for documentation/testing only)
function getDefaultAdminCredentials() {
  return { email: 'richmondobeng2004@gmail.com', password: 'Password1!' };
}

module.exports = {
  get users() {
    return loadUsers();
  },
  set users(val) {
    saveUsers(val);
  },
  loadUsers,
  saveUsers,
  ensureDefaultAdmin,
  getDefaultAdminCredentials,
  // Add wallet update helper
  creditWallet: function(email, amount) {
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      user.wallet = (user.wallet || 0) + amount;
      saveUsers(users);
      return true;
    }
    return false;
  }
};
