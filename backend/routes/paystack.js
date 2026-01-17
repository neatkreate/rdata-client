const express = require('express');
const router = express.Router();
const axios = require('axios');

// Load Paystack secret key from environment
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initiate a top-up transaction
router.post('/topup/initiate', async (req, res) => {
  const { email, amount } = req.body;
  if (!email || !amount) {
    return res.status(400).json({ message: 'Email and amount are required.' });
  }
  try {
    const payload = {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
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
      res.json(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Paystack INIT error:', error.response.data);
        res.status(500).json({ message: 'Payment initiation failed', error: error.response.data });
      } else {
        console.error('Paystack INIT error:', error);
        res.status(500).json({ message: 'Payment initiation failed', error: error.message });
      }
  }
});

module.exports = router;
