const fs = require("fs");
const path = require("path");
const mailSender = require("../service/brevo");

const sendEmail = async (email, subject, text, filePath, fileName) => {
  try {
    const templatePath = path.join(__dirname, filePath, fileName);

    let HTML = fs.readFileSync(templatePath, "utf-8");
    HTML = HTML.replace("{{OTP}}", text);

    const mail = await mailSender(email, subject, text, HTML);
    console.log(mail);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = sendEmail;
