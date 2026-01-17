// dashboardController.js
const users = require('../models/users.json');

// Dummy data for demonstration
const networks = [
    { id: 'mtn', name: 'MTN' },
    { id: 'vodafone', name: 'Vodafone' },
    { id: 'airteltigo', name: 'AirtelTigo' }
];

// Updated bundles for all networks (sync with RichDataPalace)
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
    vodafone: [
        { id: '1gb', name: '1 GB — ₵9.00' },
        { id: '2gb', name: '2 GB — ₵17.00' },
        { id: '3gb', name: '3 GB — ₵25.00' },
        { id: '4gb', name: '4 GB — ₵33.00' },
        { id: '5gb', name: '5 GB — ₵41.00' },
        { id: '10gb', name: '10 GB — ₵80.00' }
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
        { id: '9gb', name: '9 GB — ₵40.00' },
        { id: '10gb', name: '10 GB — ₵44.00' },
        { id: '11gb', name: '11 GB — ₵48.00' },
        { id: '12gb', name: '12 GB — ₵53.00' },
        { id: '13gb', name: '13 GB — ₵57.00' },
        { id: '14gb', name: '14 GB — ₵63.00' },
        { id: '15gb', name: '15 GB — ₵68.00' }
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
exports.getDataPlans = (req, res) => {
    const network = req.query.network;
    if (!network) return res.status(400).json({ error: 'Network required' });
    if (!dataPlans[network]) return res.status(404).json({ error: 'No plans for this network' });
    res.json(dataPlans[network]);
};

const fetch = require('node-fetch');
exports.buyData = async (req, res) => {
    const { network, dataPlan, beneficiary, email } = req.body;
    if (!network || !dataPlan || !beneficiary || !email) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Find user and check wallet balance
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Extract price from dataPlan string (e.g., '1 GB — ₵4.90')
    const priceMatch = dataPlan.match(/₵([\d.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : null;
    if (!price) {
        return res.status(400).json({ message: 'Could not determine package price.' });
    }
    if ((user.wallet || 0) < price) {
        return res.status(402).json({ message: 'Insufficient wallet balance.' });
    }

    // SmartDataLink API credentials (use env vars in production)
    const SMARTDATALINK_API_KEY = process.env.SMARTDATALINK_API_KEY || 'YOUR_API_KEY';
    const SMARTDATALINK_API_SECRET = process.env.SMARTDATALINK_API_SECRET || 'YOUR_API_SECRET';
    const SMARTDATALINK_BASE_URL = 'https://blessdatahub.com/api/create_order.php';

    // Prepare package size (assume dataPlan is like '1 GB — ₵4.90', extract '1GB')
    const packageSize = dataPlan.split(' ')[0].replace('GB', 'GB');

    const payload = {
        api_key: SMARTDATALINK_API_KEY,
        api_secret: SMARTDATALINK_API_SECRET,
        beneficiary,
        package_size: packageSize
    };

    try {
        const response = await fetch(SMARTDATALINK_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SMARTDATALINK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.status === 'success') {
            // Deduct from wallet and save
            user.wallet = (user.wallet || 0) - price;
            require('fs').writeFileSync(require('path').join(__dirname, '../models/users.json'), JSON.stringify(users, null, 2));
            res.json({ message: 'Data purchase successful!', order_id: result.order_ids[0], cost: result.total_cost });
        } else {
            res.status(400).json({ message: 'Data purchase failed.', details: result });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error connecting to SmartDataLink API.', error: err.message });
    }
};

exports.topUp = (req, res) => {
    // Implement real top up logic here
    res.json({ message: 'Top up successful!' });
};
