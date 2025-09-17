const fs = require("fs");
const path = require("path");
const sendGrid = require("../service/sendGrid");

const sendEmail = async (email, subject, text, filePath, fileName) => {
  try {
    const templatePath = path.join(__dirname, filePath, fileName);

    let HTML = fs.readFileSync(templatePath, "utf-8");
    HTML = HTML.replace("{{OTP}}", text);

    const mail = await sendGrid(email, subject, text, HTML);
    console.log(mail);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = sendEmail;
