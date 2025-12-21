// Handles user signup, login, and renewal status

const { users } = require('../models/user');
const crypto = require('crypto');

// Helper: Find user by email
function findUser(email) {
  return users.find(u => u.email === email);
}

// Signup: create user, require payment for yearly renewal
exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (findUser(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  // Hash password (simple demo, use bcrypt in production)
  const hashed = crypto.createHash('sha256').update(password).digest('hex');
  // Set renewal date to now, paid false
  const user = {
    id: users.length + 1,
    name,
    email,
    phone,
    password: hashed,
    renewalDate: null,
    paid: false
  };
  users.push(user);
  res.json({ status: 'success', user });
};


// Login: check credentials
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const hashed = crypto.createHash('sha256').update(password).digest('hex');
  if (user.password !== hashed) return res.status(401).json({ error: 'Invalid password' });
  // Check renewal
  const now = new Date();
  let renewalDue = true;
  if (user.renewalDate && user.paid) {
    const renewal = new Date(user.renewalDate);
    renewalDue = now > renewal;
  }
  res.json({ status: 'success', user, renewalDue });
};


// Renewal status: check if user has paid for current year
exports.renewalStatus = async (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id == userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const now = new Date();
  let renewalDue = true;
  if (user.renewalDate && user.paid) {
    const renewal = new Date(user.renewalDate);
    renewalDue = now > renewal;
  }
  res.json({ status: 'success', renewalDue, renewalDate: user.renewalDate, paid: user.paid });
};
