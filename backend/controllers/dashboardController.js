// dashboardController.js
const users = require('../models/users.json');

// Dummy data for demonstration
const networks = [
    { id: 'mtn', name: 'MTN' },
    { id: 'vodafone', name: 'Vodafone' },
    { id: 'airteltigo', name: 'AirtelTigo' }
];
const dataPlans = {
    mtn: [ { id: 'mtn1', name: '1GB - ₵10' }, { id: 'mtn2', name: '2GB - ₵18' } ],
    vodafone: [ { id: 'vod1', name: '1GB - ₵9' }, { id: 'vod2', name: '2GB - ₵17' } ],
    airteltigo: [ { id: 'air1', name: '1GB - ₵8' }, { id: 'air2', name: '2GB - ₵15' } ]
};

exports.getDashboard = (req, res) => {
    // Get user email from query, header, or session (for demo, use query or header)
    const email = req.query.email || req.headers['x-user-email'];
    if (!email) return res.status(400).json({ error: 'User email required' });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
        name: user.name || 'User',
        balance: user.wallet || 0,
        todaysSpent: user.todaysSpent || 0,
        totalSpent: user.totalSpent || 0
    });
};

exports.getNetworks = (req, res) => {
    res.json(networks);
};

const axios = require('axios');
exports.getDataPlans = async (req, res) => {
    const network = req.query.network;
    if (!network) return res.status(400).json({ error: 'Network required' });
    try {
        // Replace with your real SmartDataLink API URL and key
        const apiUrl = `https://smartdatalink.com/api/data-plans?network=${encodeURIComponent(network)}`;
        // Optionally add headers for authentication if required
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data plans', details: err.message });
    }
};

exports.buyData = (req, res) => {
    // Implement real buy logic here
    res.json({ message: 'Data purchase successful!' });
};

exports.topUp = (req, res) => {
    // Implement real top up logic here
    res.json({ message: 'Top up successful!' });
};
