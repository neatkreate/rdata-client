
require('dotenv').config();
const axios = require('axios');
const users = require('../models/users.json');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_INIT_URL = 'https://api.paystack.co/transaction/initialize';

exports.topUpMobileMoney = async (req, res) => {
  const { amount, email } = req.body;
  if (!amount || !email) return res.status(400).json({ message: 'Amount and email required.' });

  // Paystack expects amount in kobo/pesewas (multiply by 100)
  const paystackAmount = Number(amount) * 100;

  try {
    const response = await axios.post(PAYSTACK_INIT_URL, {
      amount: paystackAmount,
      email,
      currency: 'GHS',
      channels: ['mobile_money'],
      callback_url: 'https://yourdomain.com/api/top-up-callback',
      metadata: {
        custom_fields: [
          { display_name: 'Wallet Top Up', variable_name: 'wallet_top_up', value: 'Wallet Top Up' }
        ]
      }
    }, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status && response.data.data && response.data.data.authorization_url) {
      // Return Paystack payment link to frontend
      return res.json({
        message: 'Proceed to payment',
        payment_url: response.data.data.authorization_url
      });
    } else {
      return res.status(400).json({ message: 'Payment initialization failed. Please try again.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Top up error. Please try again.' });
  }
};
