const nodemailer = require('nodemailer');

// Configurazione del trasportatore email
const transporter = nodemailer.createTransport({
  // Configurazione del trasportatore email (ad esempio, Gmail)
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PWD_GMAIL,
  },
});

// Funzione per l'invio dell'email
async function gestoreEmail(recipients, subject, htmlBody ) {
  try {
    const mailOptions = {
      from: process.env.GMAIL,
      to:  recipients.join(', '),
      subject,
      html: htmlBody,
    };

    // Invio dell'email
    await transporter.sendMail(mailOptions);

    console.log('Email inviata con successo');
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
  }
}

module.exports = gestoreEmail;