const fs = require('fs');
const path = require('path');

// Dummy orders data for demonstration
const ordersFile = path.join(__dirname, '../models/orders.json');

function loadOrders() {
  if (!fs.existsSync(ordersFile)) return [];
  return JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
}


const fetch = require('node-fetch');

// SmartDataLink API credentials (replace with env vars in production)
const SMARTDATALINK_API_KEY = process.env.SMARTDATALINK_API_KEY || 'YOUR_API_KEY';
const SMARTDATALINK_BASE_URL = 'https://blessdatahub.com/api';

async function fetchOrderStatus(orderId) {
  try {
    const url = `${SMARTDATALINK_BASE_URL}/check_order_status.php?order_id=${orderId}&api_key=${SMARTDATALINK_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.success && data.orders && data.orders.length > 0) {
      return {
        status: data.orders[0].status,
        status_description: data.orders[0].status_description,
        is_completed: data.orders[0].is_completed
      };
    }
  } catch (e) {}
  return { status: 'unknown', status_description: 'Status unavailable', is_completed: false };
}

exports.getOrders = async (req, res) => {
  // In a real app, filter by user
  const orders = loadOrders();
  // Fetch status for each order from SmartDataLink
  const ordersWithStatus = await Promise.all(orders.map(async (order) => {
    const statusInfo = await fetchOrderStatus(order.id);
    return { ...order, ...statusInfo };
  }));
  res.json({ orders: ordersWithStatus });
};
