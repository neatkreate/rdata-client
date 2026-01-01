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
    res.status(200).json({ status: 'success', data: response.data });
  } catch (error) {
    // Always return valid JSON error
    let errMsg = error.message;
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        errMsg = error.response.data;
      } else if (error.response.data.error) {
        errMsg = error.response.data.error;
      } else {
        errMsg = JSON.stringify(error.response.data);
      }
    }
    res.status(500).json({ status: 'error', error: errMsg });
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


// List available bundles from Smartdatalink API
exports.listBundles = async (req, res) => {
  try {
    const bundles = [
      { id: 1, network: 'MTN', data: '1GB', price: 4.50 },
      { id: 2, network: 'MTN', data: '2GB', price: 9.00 },
      { id: 3, network: 'MTN', data: '4GB', price: 18.00 },
      { id: 4, network: 'MTN', data: '10GB', price: 42.00 },
      { id: 5, network: 'Telecel', data: '1GB', price: 4.50 },
      { id: 6, network: 'Telecel', data: '2GB', price: 9.00 },
      { id: 7, network: 'Telecel', data: '4GB', price: 18.00 },
      { id: 8, network: 'Telecel', data: '10GB', price: 42.00 },
      { id: 9, network: 'AirtelTigo', data: '1GB', price: 4.50 },
      { id: 10, network: 'AirtelTigo', data: '2GB', price: 9.00 },
      { id: 11, network: 'AirtelTigo', data: '4GB', price: 18.00 },
      { id: 12, network: 'AirtelTigo', data: '10GB', price: 42.00 }
    ];
    res.status(200).json({ status: 'success', data: bundles });
  } catch (err) {
    res.status(500).json({ status: 'error', data: [], error: err.message });
  }
};
