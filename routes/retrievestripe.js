const express = require('express');
const router = express.Router();

const stripe = require('stripe')(
  process.env.stripe_secret
);

const {
  saveStripeDonation,
} = require('../controller/donationController');

router.get(
  '/retrieve-session/:sessionId',
  async (req, res) => {
    const { sessionId } = req.params;

    try {
      const session =
        await stripe.checkout.sessions.retrieve(
          sessionId
        );

      if (session.payment_status !== 'paid') {
        return res.status(400).json({
          error: 'Payment has not been completed',
        });
      }

      const donation =
        await saveStripeDonation({
          session,
        });

      res.json({
        success: true,
        session,
        donation,
      });
    } catch (error) {
      console.error(
        'Error retrieving Stripe session:',
        error
      );

      res.status(500).json({
        error: 'Unable to retrieve session data',
      });
    }
  }
);

module.exports = router;
