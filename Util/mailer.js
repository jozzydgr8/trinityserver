const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.webusername,   
    pass: process.env.mailpass      
  }
});

function sendEmail({ recipient_email, subject, message }) {
  return new Promise((resolve, reject) => {
    const mail_configs = {
      from: 'info@thetrinityarmsfoundation.com',
      to: recipient_email,
      subject,
      html: message
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        return reject({ message: 'An error occurred while sending email.' });
      }
      return resolve({ message: 'Email sent successfully.' });
    });
  });
}

module.exports = sendEmail;
