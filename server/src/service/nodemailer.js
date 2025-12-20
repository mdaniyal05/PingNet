const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_API_KEY,
  },
});

const mailSender = async (email, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"PingNet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
      text: text,
    });
    console.log("Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
};

module.exports = mailSender;
