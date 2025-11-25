const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, subject, text, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    if (error) {
      console.error(error);
    }

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = mailSender;
