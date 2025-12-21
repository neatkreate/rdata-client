// Handles Smartdatalink API integration for bundle purchase and status

const axios = require('axios');
const SMARTDATALINK_API_URL = 'https://blessdatahub.com/api/create_order.php';
const SMARTDATALINK_STATUS_URL = 'https://blessdatahub.com/api/check_order_status.php';
const SMARTDATALINK_API_KEY = process.env.SMARTDATALINK_API_KEY || 'YOUR_API_KEY';
const SMARTDATALINK_API_SECRET = process.env.SMARTDATALINK_API_SECRET || 'YOUR_API_SECRET';

// Purchase bundle via Smartdatalink API
exports.purchaseBundle = async (req, res) => {
  const { beneficiary, package_size } = req.body;
  try {
    const response = await axios.post(
      SMARTDATALINK_API_URL,
      {
        api_key: SMARTDATALINK_API_KEY,
        api_secret: SMARTDATALINK_API_SECRET,
        beneficiary,
        package_size
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SMARTDATALINK_API_KEY}`
        }
      }
    );
    res.json({ status: 'success', data: response.data });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.response?.data || error.message });
  }
};


// Check order status via Smartdatalink API
exports.checkOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  try {
    const response = await axios.get(
      `${SMARTDATALINK_STATUS_URL}?order_id=${orderId}&api_key=${SMARTDATALINK_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SMARTDATALINK_API_KEY}`
        }
      }
    );
    res.json({ status: 'success', data: response.data });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.response?.data || error.message });
  }
};
