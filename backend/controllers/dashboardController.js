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
    // Replace with real user lookup
    const user = users[0];
    res.json({
        name: user.name || 'User',
        balance: user.balance || 0,
        todaysSpent: user.todaysSpent || 0,
        totalSpent: user.totalSpent || 0
    });
};

exports.getNetworks = (req, res) => {
    res.json(networks);
};

exports.getDataPlans = (req, res) => {
    const network = req.query.network;
    res.json(dataPlans[network] || []);
};

exports.buyData = (req, res) => {
    // Implement real buy logic here
    res.json({ message: 'Data purchase successful!' });
};

exports.topUp = (req, res) => {
    // Implement real top up logic here
    res.json({ message: 'Top up successful!' });
};
