
const express = require('express');
const router = express.Router();

const stripe = require('stripe')(
  process.env.stripe_secret
);

router.post(
  '/create-checkout-session',
  async (req, res) => {
    const { product, customer } = req.body;

    try {
      const session =
        await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',

          line_items: [
            {
              price_data: {
                currency:
                  product.currency.toLowerCase(),

                product_data: {
                  name: product.name,
                },

                // $25 -> 2500
                // £25 -> 2500
                unit_amount: product.price,
              },

              quantity: 1,
            },
          ],

          customer_email:
            customer?.email || undefined,

          metadata: {
            donorName: customer?.name || '',
            donorPhone: customer?.phone || '',
            comment: customer?.comment || '',
          },

          success_url:
            'https://thetrinityarmsfoundation.com/stripesuccess?session_id={CHECKOUT_SESSION_ID}',

          cancel_url:
            'https://thetrinityarmsfoundation.com/donate',
        });

      res.json({
        url: session.url,
        sessionId: session.id,
      });
    } catch (err) {
      console.error(
        'Stripe Checkout session error:',
        err
      );

      res.status(500).json({
        error:
          'Something went wrong creating session',
      });
    }
  }
);

module.exports = router;
