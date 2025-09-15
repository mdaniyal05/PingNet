const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailSender = async (email, subject, text, html) => {
  try {
    const message = {
      to: email,
      from: process.env.MAIL_SENDER,
      subject: subject,
      text: text,
      html: html,
    };

    const isEmailSent = await sgMail.send(message);

    if (isEmailSent) {
      console.log("Email sent.");
      console.log(isEmailSent);
      return true;
    }
  } catch (error) {
    console.error("Unable to send email: ", error);
  }
};

module.exports = mailSender;
