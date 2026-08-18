const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    // Donor information
    name: {
      type: String,
      trim: true,
      default: 'Anonymous',
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    anonymous: {
      type: Boolean,
      default: false,
    },

    // Donation information
    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: ['USD', 'GBP', 'NGN'],
      required: true,
    },

    comment: {
      type: String,
      trim: true,
    },

    // Payment information
    paymentMethod: {
      type: String,
      enum: ['Stripe', 'PayPal', 'Bank Transfer'],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        'pending',
        'completed',
        'failed',
        'cancelled',
      ],
      default: 'pending',
    },

    // Stripe / PayPal transaction ID
    transactionId: {
      type: String,
      index: true,
    },

    // Stripe Checkout Session ID
    stripeSessionId: {
      type: String,
      index: true,
      sparse: true,
    },

    // PayPal Order ID
    paypalOrderId: {
      type: String,
      index: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Donation',
  donationSchema
);
