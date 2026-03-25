// File: backend/utils/paypalConfig.js
// PayPal Global Setup (Stripe can also be added here later)
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'live', // sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID || 'TriNetra_PayPal_Client_Key',
  'client_secret': process.env.PAYPAL_CLIENT_SECRET || 'TriNetra_PayPal_Secret_Key'
});

module.exports = paypal;
