const bcrypt = require("bcrypt");
const User = require("../models/signup");
const jwt = require("jsonwebtoken");

const changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    result = jwt.verify(token, process.env.SECRET);
    let user = await User.findById(result.id);
    const oldPassword = user.password;
    const { currentPassword } = req.body;

    if (currentPassword === oldPassword) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const userPassword = await User.findByIdAndUpdate(
        { _id: result.id },

        { password: password }
      );
      return res.json(userPassword);
    } else {
      res.status(400).json({
        message: "Enter correct current password",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = changePassword;
