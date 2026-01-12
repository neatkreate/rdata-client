const express = require('express');
const router = express.Router();
const axios = require('axios');
const userModel = require('../models/user');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Paystack webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Paystack sends events as raw body
  const event = req.body;
  try {
    // Only handle successful charge events
    if (event.event === 'charge.success') {
      const { reference, amount, customer } = event.data;
      // Credit user wallet using email
      const credited = userModel.creditWallet(customer.email, amount / 100);
      if (credited) {
        console.log(`Wallet top-up: ${customer.email} +${amount / 100} (ref: ${reference})`);
      } else {
        console.log(`User not found for wallet top-up: ${customer.email}`);
      }
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: 'Webhook error', error: err.message });
  }
});

module.exports = router;
