const nodemailer = require('nodemailer');
const htmlBodyTaskCompletata = require('fs').readFileSync(require('path').join(__dirname, '.', 'taskCompletata.html'), 'utf8');
const htmlBodyTaskAssegnata = require('fs').readFileSync(require('path').join(__dirname, '.', 'taskAssegnata.html'), 'utf8');
const htmlBodyRecuperoPwd = require("fs").readFileSync(require("path").join(__dirname, '.',"recuperoPassword.html" ), "utf8");
const htmlBodyConfermaAcc = require("fs").readFileSync(require("path").join(__dirname, '.', "confermaAccount.html" ), "utf8");
const htmlBodyconfermaModificaEmail = require("fs").readFileSync(require("path").join(__dirname, '.', "confermaModificaEmail.html" ), "utf8");
const htmlBodyBenvenuto = require("fs").readFileSync(require("path").join(__dirname, '.', "benvenuto.html" ), "utf8");



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PWD_GMAIL,
  },
});


class GestoreEmail {

  static async inviaEmail(recipients, subject, htmlBody ) {
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

  static async inviaEmailTaskCompletata(recipients, subject, nomeTask, deadline, nomeGruppo, nomeMembro) {
      const formattedHtmlBody = htmlBodyTaskCompletata
          .replace('{{taskName}}', nomeTask)
          .replace('{{deadline}}', deadline)
          .replace('{{groupName}}', nomeGruppo)
          .replace('{{memberName}}', nomeMembro);
      await GestoreEmail.inviaEmail(recipients, subject, formattedHtmlBody);
  }

  static async inviaEmailTaskAssegnata(recipients, subject, nomeTask, deadline, nomeGruppo, acceptRejectLink) {
    const formattedHtmlBody = htmlBodyTaskAssegnata
        .replace('{{taskName}}', nomeTask)
        .replace('{{deadline}}', deadline)
        .replace('{{groupName}}', nomeGruppo)
        .replace('{{acceptRejectLink}}', acceptRejectLink)
    await GestoreEmail.inviaEmail(recipients, subject, formattedHtmlBody);
  }

  static async inviaEmailRecuperoPwd(recipients, subject, recoveryLink) {
    const formattedHtmlBody = htmlBodyRecuperoPwd.replace("{{recoveryLink}}", recoveryLink);
    await GestoreEmail.inviaEmail(recipients, subject, formattedHtmlBody);
  }

  static async inviaEmailConfermaAcc(recipients, subject, accountConfirmationLink) {
    const formattedHtmlBody = htmlBodyConfermaAcc.replace("{{accountConfirmationLink}}", accountConfirmationLink);
    await GestoreEmail.inviaEmail(recipients, subject, formattedHtmlBody);
  }

  static async inviaEmailConfermaModificaEmail(recipients, subject, emailConfirmationLink) {
    const formattedHtmlBody = htmlBodyconfermaModificaEmail.replace("{{emailConfirmationLink}}", emailConfirmationLink);
    await GestoreEmail.inviaEmail(recipients, subject, formattedHtmlBody);
  }

  static async inviaEmailBenvenuto(recipients, subject) {
    await GestoreEmail.inviaEmail(recipients, subject, htmlBodyBenvenuto);
  }
  
}


module.exports = GestoreEmail