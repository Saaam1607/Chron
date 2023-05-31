const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PWD_GMAIL,
    },
});

async function gestoreEmail(recipients, subject, htmlBody ) {
  try {
    const mailOptions = {
      from: process.env.GMAIL,
      to:  recipients.join(', '),
      subject,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    //console.error('Errore durante l\'invio dell\'email:', error);
    throw new Error('Errore durante l\'invio dell\'email', error);
  }
}

module.exports = gestoreEmail;