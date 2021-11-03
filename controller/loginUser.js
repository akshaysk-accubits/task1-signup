const User = require("../models/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  let { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email is required!" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is required!" });
  }
  let user = await User.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign(
          {
            id: user._id,
            name: user.name,
          },
          process.env.SECRET
        );
        res.json({
          message: "Login Successfull",
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid Password or email" });
      }
    });
  } else {
    return res.status(401).json({ message: "User not found!" });
  }
};

module.exports = loginUser;
