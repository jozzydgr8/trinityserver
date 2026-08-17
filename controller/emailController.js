const Subscriber = require('../schema/subscribeSchema');
const sendEmail = require('../config/mailer');
const subscriptionMessage = async (req, res) => {
  if (!req.body.recipient_email) {
    return res.status(400).send({ message: 'Missing recipient_email.' });
  }

  try {
    await sendEmail(req.body);
    res.send({ message: 'Subscription email sent.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const sendSingleMessage = async (req, res) => {
  try {
    await sendEmail(req.body);
    res.send({ message: 'Email sent successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const sendNewsLetter = async (req, res) => {
  const { subject, message, recipient_email } = req.body;

  try {
    // Build database query
    const query = {};

    // If specific recipients were selected
    if (Array.isArray(recipient_email) && recipient_email.length > 0) {
      query.email = { $in: recipient_email };
    }

    // Get subscribers
    const subscribers = await Subscriber.find(query).select("email");

    if (subscribers.length === 0) {
      return res.status(404).send({
        message: "No subscribers found.",
      });
    }

    // Send the same newsletter to every subscriber
    const emailPromises = subscribers.map((subscriber) =>
      sendEmail({
        subject,
        message,
        recipient_email: subscriber.email,
      })
    );

    await Promise.all(emailPromises);

    return res.status(200).send({
      message: `Newsletter successfully sent to ${subscribers.length} subscriber(s).`,
    });
  } catch (error) {
    console.error("Newsletter Error:", error);

    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports={subscriptionMessage, sendSingleMessage, sendNewsLetter}