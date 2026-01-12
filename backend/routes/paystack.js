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
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100 // Paystack expects amount in kobo
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to initiate transaction', error: error.response?.data || error.message });
  }
});

module.exports = router;
