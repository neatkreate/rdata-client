
// User model using JSON file for persistence
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

let users = loadUsers();


// Always ensure a default admin user exists
function ensureDefaultAdmin() {
  const adminEmail = 'richmondobeng2004@gmail.com';
  const adminPassword = 'Password1!';
  let users = loadUsers();
  let admin = users.find(u => u.email === adminEmail);
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 10); // 10 years in the future
  if (!admin) {
    admin = {
      id: users.length + 1,
      name: 'Admin',
      email: adminEmail,
      phone: '',
      password: crypto.createHash('sha256').update(adminPassword).digest('hex'),
      renewalDate: futureDate.toISOString(),
      paid: true,
      isAdmin: true,
      role: 'admin'
    };
    users.push(admin);
    saveUsers(users);
  } else {
    admin.renewalDate = futureDate.toISOString();
    admin.paid = true;
    admin.role = 'admin';
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
  getDefaultAdminCredentials
};
