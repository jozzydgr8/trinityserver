const Donation = require('../schema/donationSchema');

const savePayPalDonation = async (req, res) => {
  try {
    const {
      order,
      name,
      email,
      phone,
      amount,
      currency,
      message,
    } = req.body;

    // Make sure we received an order
    if (!order) {
      return res.status(400).json({
        error: 'PayPal order is required',
      });
    }

    // Make sure PayPal says payment is completed
    if (order.status !== 'COMPLETED') {
      return res.status(400).json({
        error: 'PayPal payment was not completed',
        status: order.status,
      });
    }

    // PayPal order ID
    const paypalOrderId = order.id;

    if (!paypalOrderId) {
      return res.status(400).json({
        error: 'PayPal order ID is missing',
      });
    }

    /*
     * Prevent duplicate donations.
     *
     * If the frontend somehow sends the same
     * PayPal order twice, we don't create
     * two MongoDB records.
     */
    const existingDonation =
      await Donation.findOne({
        paypalOrderId,
      });

    if (existingDonation) {
      return res.json({
        success: true,
        message: 'Donation already saved',
        donation: existingDonation,
      });
    }

    /*
     * Get the amount/currency from the PayPal
     * order itself when available.
     */
    const paypalAmount =
      order.purchase_units?.[0]?.amount?.value;

    const paypalCurrency =
      order.purchase_units?.[0]?.amount
        ?.currency_code;

    const finalAmount =
      paypalAmount !== undefined
        ? Number(paypalAmount)
        : Number(amount);

    const finalCurrency =
      paypalCurrency || currency;

    /*
     * Save donation
     */
    const donation = await Donation.create({
      name: name || 'Anonymous',

      email: email || '',

      phone: phone || '',

      amount: finalAmount,

      currency: finalCurrency,

      comment: message || '',

      paymentMethod: 'PayPal',

      paymentStatus: 'completed',

      transactionId: paypalOrderId,

      paypalOrderId,
    });

    return res.status(201).json({
      success: true,
      message: 'PayPal donation saved successfully',
      donation,
    });
  } catch (error) {
    console.error(
      'Error saving PayPal donation:',
      error
    );

    return res.status(500).json({
      error: 'Unable to save PayPal donation',
    });
  }
};

module.exports = {
  savePayPalDonation,
};
