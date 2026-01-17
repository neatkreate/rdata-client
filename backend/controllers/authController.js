// Handles user signup, login, and renewal status


const User = require('../models/user');
const crypto = require('crypto');

// Signup: create user, require payment for yearly renewal
exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash password (simple demo, use bcrypt in production)
    const hashed = crypto.createHash('sha256').update(password).digest('hex');
    // Set renewal date to now, paid false
    const user = new User({
      name,
      email,
      phone,
      password: hashed,
      renewalDate: null,
      paid: false
    });
    await user.save();
    res.json({ status: 'success', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Login: check credentials
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const hashed = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password !== hashed) return res.status(401).json({ error: 'Invalid password' });
    // Only allow login if agent is approved (isVerified === true)
    if (user.role === 'agent' && !user.isVerified) {
      return res.status(403).json({ error: 'Agent not approved by admin yet.' });
    }
    // Check renewal
    const now = new Date();
    let renewalDue = true;
    if (user.renewalDate && user.paid) {
      const renewal = new Date(user.renewalDate);
      renewalDue = now > renewal;
    }
    res.json({ status: 'success', user, renewalDue });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Renewal status: check if user has paid for current year
exports.renewalStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const now = new Date();
    let renewalDue = true;
    if (user.renewalDate && user.paid) {
      const renewal = new Date(user.renewalDate);
      renewalDue = now > renewal;
    }
    res.json({ status: 'success', renewalDue, renewalDate: user.renewalDate, paid: user.paid });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get agent profile by email
exports.getAgentProfile = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const user = await User.findOne({ email, role: 'agent' });
    if (!user) return res.status(404).json({ error: 'Agent not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
