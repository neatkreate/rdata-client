const express = require('express');
const router = express.Router();
const { users } = require('../models/user');

// Sample notifications (replace with DB in production)
let notifications = [
  { id: 1, message: 'New agent signed up', date: '2025-12-29', type: 'info', user: 'Kojo Mensah' },
  { id: 2, message: 'Bundle purchase completed', date: '2025-12-29', type: 'success', user: 'Akua Serwaa' },
  { id: 3, message: 'System alert: maintenance scheduled', date: '2025-12-28', type: 'alert', user: 'System' }
];

// GET /api/admin/notifications
router.get('/notifications', (req, res) => {
  res.json({ notifications });
});

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  // Example stats (replace with DB queries)
  const totalAgents = users.filter(u => u.role === 'agent').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalUsers = users.length;
  // You can add more stats as needed
  res.json({
    totalAgents,
    totalAdmins,
    totalUsers,
    totalSales: 120, // Replace with real sales data
    totalRevenue: 50000, // Replace with real revenue data
    bundlesSold: 300 // Replace with real bundles data
  });
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  res.json({ users });
});

// Approve agent payment (set paid=true and update renewalDate)
router.post('/approve-payment/:userId', (req, res) => {
  const userModel = require('../models/user');
  const users = userModel.loadUsers();
  const user = users.find(u => u.id == req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.paid = true;
  // Set renewalDate to one year from today
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  user.renewalDate = nextYear.toISOString();
  userModel.saveUsers(users);
  res.json({ status: 'success', user });
});

module.exports = router;
