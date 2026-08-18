const express = require('express');

const router = express.Router();

const {
  savePayPalDonation,
} = require('../controller/paypalContoller');

router.post(
  '/paypal/save-donation',
  savePayPalDonation
);

module.exports = router;
