# RData Backend API Documentation

## Authentication

### POST /api/auth/signup
- Registers a new user.
- Request body: `{ name, email, phone, password }`
- Response: `{ status, user }`

### POST /api/auth/login
- Logs in a user.
- Request body: `{ email, password, role }`
- Response: `{ status, user, renewalDue }`
- If `renewalDue` is true, user must pay yearly registration fee before access.

### GET /api/auth/renewal-status/:userId
- Checks if user has paid registration fee for current year.
- Response: `{ status, renewalDue, renewalDate, paid }`

---

## Payment

### POST /api/payment/paystack/initiate
- Initiates Paystack payment for registration fee.
- Request body: `{ email, amount }`
- Response: `{ status, data }` (includes Paystack payment URL)

### POST /api/payment/paystack/webhook
- Handles Paystack webhook events for payment verification.
- Request body: Paystack event payload
- Response: `200 OK` on success

---

## Bundles

### POST /api/bundle/purchase
- Purchases a data bundle via Smartdatalink API.
- Request body: `{ beneficiary, package_size }`
- Response: `{ status, data }`

### GET /api/bundle/status/:orderId
- Checks status of a bundle order.
- Response: `{ status, data }`

---

## Notes
- All endpoints expect and return JSON.
- Registration fee is GHC 100, yearly renewal enforced.
- Payment and bundle endpoints require user authentication.
