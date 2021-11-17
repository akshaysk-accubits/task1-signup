const User = require("../models/signup");
const sendMail = require("../middlewares/mail").sendMail;
const { bcrypt } = require("bcrypt");
const jwt = require("jsonwebtoken");

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      let mailParams = {
        to: email,
        subject: "Password Reset",
        text: `to reset, please click: ${process.env.FORGOT_PASSWORD_URL}${token} `,
      };
      console.log(mailParams);
      await sendMail(mailParams);
      res.status(200).json({
        message: "Password reset",
      });
    } else {
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = forgotPassword;
