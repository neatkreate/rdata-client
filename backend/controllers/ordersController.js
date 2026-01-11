const fs = require('fs');
const path = require('path');

// Dummy orders data for demonstration
const ordersFile = path.join(__dirname, '../models/orders.json');

function loadOrders() {
  if (!fs.existsSync(ordersFile)) return [];
  return JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
}

exports.getOrders = (req, res) => {
  // In a real app, filter by user
  const orders = loadOrders();
  res.json({ orders });
};
