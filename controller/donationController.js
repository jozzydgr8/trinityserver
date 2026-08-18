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

module.exports = {
  saveStripeDonation,
};
