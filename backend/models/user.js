
// User model (for demonstration, use a real DB in production)
const crypto = require('crypto');
const users = [];


// Always ensure a default admin user exists
function ensureDefaultAdmin() {
  const adminEmail = 'richmondobeng2004@gmail.com';
  const adminPassword = 'Password1!';
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
      isAdmin: true
    };
    users.push(admin);
  } else {
    admin.renewalDate = futureDate.toISOString();
    admin.paid = true;
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
  users,
  ensureDefaultAdmin,
  getDefaultAdminCredentials
};
