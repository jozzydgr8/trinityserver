const nodemailer = require("nodemailer");
  console.log("EMAIL:", process.env.EMAIL);
console.log(
  "PASSWORD EXISTS:",
  !!process.env.EMAIL_APP_PASSWORD
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.webusername,
    pass: process.env.mailpass,
  },
});

async function sendEmail({ recipient_email, subject, message }) {


  try {
    const mail_configs = {
      from: process.env.webusername,
      to: recipient_email,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(mail_configs);

    console.log("Email sent");

    return {
      message: "Email sent successfully.",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Nodemailer error:", error);

    throw error;
  }
}

module.exports = sendEmail;