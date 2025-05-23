require('dotenv').config();
const express = require('express');
const router = express.Router();

const stripe = require('stripe')(process.env.stripe_secret);

router.post('/create-checkout-session', async (req, res) => {
  const { product } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
            },
            unit_amount: product.price, // in cents
          },
          quantity: 1,
        },
      ],
      success_url: `https://thetrinityarmsfoundation.com/stripesuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://thetrinityarmsfoundation.com/donate',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout session error:', err);
    res.status(500).json({ error: 'Something went wrong creating session' });
  }
});

module.exports = router;