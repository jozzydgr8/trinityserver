require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.stripe_secret);

router.get('/retrieve-session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
  
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.json(session);
    } catch (err) {
      console.error('Error retrieving session:', err);
      res.status(500).json({ error: 'Unable to retrieve session data' });
    }
  });
  
  module.exports = router;
  