// dashboardController.js
const users = require('../models/users.json');

// Dummy data for demonstration
const networks = [
    { id: 'mtn', name: 'MTN' },
    { id: 'vodafone', name: 'Vodafone' },
    { id: 'airteltigo', name: 'AirtelTigo' }
];

// RichDataPalace MTN Non-Expiry Bundles
const dataPlans = {
    mtn: [
        { id: '1gb', name: '1 GB — ₵4.90' },
        { id: '2gb', name: '2 GB — ₵9.80' },
        { id: '3gb', name: '3 GB — ₵14.70' },
        { id: '4gb', name: '4 GB — ₵19.40' },
        { id: '5gb', name: '5 GB — ₵24.50' },
        { id: '6gb', name: '6 GB — ₵29.30' },
        { id: '8gb', name: '8 GB — ₵39.40' },
        { id: '10gb', name: '10 GB — ₵48.00' },
        { id: '15gb', name: '15 GB — ₵70.00' },
        { id: '20gb', name: '20 GB — ₵95.00' },
        { id: '25gb', name: '25 GB — ₵120.00' },
        { id: '30gb', name: '30 GB — ₵140.00' },
        { id: '40gb', name: '40 GB — ₵190.00' },
        { id: '50gb', name: '50 GB — ₵230.00' }
    ],
    telecel: [
        { id: '10gb', name: '10 GB — ₵46.00' },
        { id: '15gb', name: '15 GB — ₵65.00' },
        { id: '20gb', name: '20 GB — ₵85.00' },
        { id: '25gb', name: '25 GB — ₵95.00' },
        { id: '30gb', name: '30 GB — ₵120.00' },
        { id: '40gb', name: '40 GB — ₵160.00' },
        { id: '50gb', name: '50 GB — ₵194.00' },
        { id: '100gb', name: '100 GB — ₵372.00' }
    ],
    airteltigo: [
        { id: '1gb', name: '1 GB — ₵4.50' },
        { id: '2gb', name: '2 GB — ₵9.00' },
        { id: '3gb', name: '3 GB — ₵13.50' },
        { id: '4gb', name: '4 GB — ₵18.00' },
        { id: '5gb', name: '5 GB — ₵22.50' },
        { id: '6gb', name: '6 GB — ₵27.00' },
        { id: '7gb', name: '7 GB — ₵31.00' },
        { id: '8gb', name: '8 GB — ₵35.00' },
        { id: '10gb', name: '10 GB — ₵44.00' },
        { id: '11gb', name: '11 GB — ₵48.00' },
        { id: '12gb', name: '12 GB — ₵53.00' },
        { id: '13gb', name: '13 GB — ₵57.00' },
        { id: '14gb', name: '14 GB — ₵63.00' },
        { id: '15gb', name: '15 GB — ₵68.00' }
    ]
};

exports.getDashboard = (req, res) => {
    // Get user email from query, header, or session (for demo, use query or header)
    const email = req.query.email || req.headers['x-user-email'];
    if (!email) return res.status(400).json({ error: 'User email required' });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Only show the name used at signup
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
