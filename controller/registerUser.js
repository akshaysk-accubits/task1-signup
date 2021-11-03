const User = require("../models/signup");
const sendMail = require("../middlewares/mail").sendMail;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("../models/signup");
const saltRounds = 10;

const registerUser = async (req, res) => {
  let { firstName, lastName, email, password, dateOfBirth, phoneNumber } =
    req.body;
  const usercount = await User.countDocuments({ email });
  if (usercount > 0) {
    return res.json({ message: "email already in use!" });
  }

  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    User.create({
      firstName,
      lastName,
      email,
      password: hash,
      dateOfBirth,
      phoneNumber,
    })
      .then(async (result) => {
        console.log("Result: ", result);
        var mailParams = {
          to: email,
          subject: "Registration Successful",
          text: "Welcome!",
        };
        await sendMail(mailParams);
        res.status(500).json({
          message: "User created",
          result: result,
        });
      })
      .catch((err) => {
        console.log("Error", err);
        res.status(500).json({
          error: err,
        });
      });
  });
};

module.exports = registerUser;
