
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

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: payAmount,
        currency: 'GHS'
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ status: 'success', data: response.data });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.response?.data || error.message
    });
  }
};

// Paystack webhook handler
exports.paystackWebhook = async (req, res) => {
  const event = req.body;

  // Optionally verify signature here for security
  if (event.event === 'charge.success') {
    // TODO: Mark user as paid for the year, update renewal date
    // event.data contains transaction details
    res.sendStatus(200);
  } else {
    res.sendStatus(200);
  }
};