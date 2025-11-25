const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, subject, text, html) => {
  try {
    const mail = resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    console.log(mail);
  } catch (error) {
    console.error(error);
  }
};

module.exports = mailSender;
