const Donation = require('../schema/donationSchema');

const saveStripeDonation = async ({ session }) => {
  // Check if this Stripe session has already been saved
  const existingDonation = await Donation.findOne({
    stripeSessionId: session.id,
  });

  if (existingDonation) {
    console.log(
      'Donation already exists:',
      session.id
    );

    return existingDonation;
  }

  const donation = await Donation.create({
    name: session.metadata?.donorName || 'Anonymous',

    email:
      session.customer_details?.email || '',

    phone:
      session.metadata?.donorPhone || '',

    amount:
      session.amount_total / 100,

    currency:
      session.currency.toUpperCase(),

    comment:
      session.metadata?.comment || '',

    paymentMethod: 'Stripe',

    paymentStatus: 'completed',

    transactionId: session.id,

    stripeSessionId: session.id,
  });

  return donation;
};

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (error) {
    console.error(
      'Error fetching donations:',
      error
    );

    res.status(500).json({
      success: false,
      error: 'Unable to fetch donations',
    });
  }
};

module.exports = {
  saveStripeDonation, getDonations
};
