
// Handles Paystack payment initiation and webhook verification



const axios = require('axios');

// Load keys from environment variables
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initiate Paystack payment
exports.initiatePaystack = async (req, res) => {
  const { email, amount } = req.body;
  try {
    // Convert GHC to kobo (Paystack expects amount in kobo)
    const payAmount = Math.round(amount * 100);
    const payload = {
      email,
      amount: payAmount,
      currency: 'GHS',
      channels: ['mobile_money']
    };
    console.log('Paystack INIT payload:', payload);
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ status: 'success', data: response.data });
  } catch (error) {
    if (error.response) {
      console.error('Paystack INIT error:', error.response.data);
      res.status(500).json({ status: 'error', error: error.response.data });
    } else {
      console.error('Paystack INIT error:', error);
      res.status(500).json({ status: 'error', error: error.message });
    }
  }
};

// Paystack webhook handler
const userModel = require('../models/user');
exports.paystackWebhook = async (req, res) => {
  const event = req.body;

  // Optionally verify signature here for security
  if (event.event === 'charge.success') {
    // Mark user as paid for the year, update renewal date
    const email = event.data.customer.email;
    let users = userModel.loadUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      user.paid = true;
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      user.renewalDate = nextYear.toISOString();
      userModel.saveUsers(users);
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(200);
  }
};