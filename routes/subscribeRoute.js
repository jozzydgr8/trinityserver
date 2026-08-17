

const router = require('express').Router();
const Subscribe = require('../schema/subscribeSchema');
const validator = require('validator');
const sendEmail = require('../config/mailer');

const authenticator = require('../middleware/authenticator');


router.get('/', authenticator, async(req,res)=>{
    try{
        const data = await Subscribe.find({});
        res.status(200).json(data);
    }catch(error){
        res.status(400).json({error:error})
    }
});

router.post("/", async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      error: "Invalid email",
    });
  }

  try {
    // Check if email already exists
    const exist = await Subscribe.findOne({ email });

    if (exist) {
      return res.status(400).json({
        error: "Email already subscribed",
      });
    }

    // Create subscriber
    await Subscribe.create({ email });

    // Send welcome email
    const emailBody = {
      recipient_email: email,
      subject: "Welcome to Trinity Arms Foundation's Newsletter!",
      message: `
        <p>Dear Subscriber,</p>

        <p>
          Thank you for subscribing to the Trinity Arms Foundation newsletter!
          We are delighted to have you join our community.
        </p>

        <p>
          Through our newsletter, you'll receive updates about our initiatives,
          programs, community activities, impact stories, and opportunities
          to support the work we do.
        </p>

        <p>You can look forward to:</p>

        <ul>
          <li>Updates on our community programs and initiatives</li>
          <li>Stories highlighting the impact of our work</li>
          <li>Information about upcoming events and activities</li>
          <li>Opportunities to support and participate in our programs</li>
          <li>News and developments from Trinity Arms Foundation</li>
        </ul>

        <p>
          Our goal is to build stronger communities and create meaningful
          opportunities that positively impact lives.
        </p>

        <p>
          Thank you for being part of the Trinity Arms Foundation community.
          We look forward to keeping you informed about the work we are doing
          and the difference we are making together.
        </p>

        <p>Welcome aboard!</p>

        <p>
          Best regards,<br />
          <strong>Trinity Arms Foundation</strong>
        </p>
      `,
    };

    await sendEmail(emailBody);

    return res.status(200).json({
      message: "Successfully subscribed",
    });
  } catch (error) {
    console.error("Subscription Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports=router