var nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
require("../models/signup");
require("../routes/auth");

const auth = {
  auth: {
    api_key:
      process.env.API_KEY ||
      "d4bbd16b0dc5128822a8facd97fd25f6-20ebde82-0e704599",
    domain:
      process.env.DOMAIN ||
      "sandbox320bc546b03447beb8be5ac9129dd66e.mailgun.org",
  },
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = async (params) => {
  console.log("params", params);
  var mailOptions = {
    from: "ask28696@gmail.com",
    to: params.to,
    subject: params.subject,
    text: params.text,
    link: params.link,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports.sendMail = sendMail;
