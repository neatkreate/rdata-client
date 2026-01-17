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
    vodafone: [ { id: 'vod1', name: '1GB - ₵9' }, { id: 'vod2', name: '2GB - ₵17' } ],
    airteltigo: [ { id: 'air1', name: '1GB - ₵8' }, { id: 'air2', name: '2GB - ₵15' } ]
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
exports.getDataPlans = (req, res) => {
    const network = req.query.network;
    if (!network) return res.status(400).json({ error: 'Network required' });
    if (!dataPlans[network]) return res.status(404).json({ error: 'No plans for this network' });
    res.json(dataPlans[network]);
};

exports.buyData = (req, res) => {
    // Implement real buy logic here
    res.json({ message: 'Data purchase successful!' });
};

exports.topUp = (req, res) => {
    // Implement real top up logic here
    res.json({ message: 'Top up successful!' });
};
