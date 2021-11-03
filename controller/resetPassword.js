const bcrypt = require("bcrypt");
const User = require("../models/signup");
const jwt = require("jsonwebtoken");

const resetPassword = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const options = {
      expiresIn: process.env.JWT_EXPIRE,
    };

    result = jwt.verify(token, process.env.RESET_PASSWORD_KEY);
    req.decoded = result;
    console.log(result);

    if (token) {
      let user = await User.findById(result.id);
      console.log("user", user);
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      console.log(password);
      user.password = password;
      const userPassword = await User.findByIdAndUpdate(
        { _id: result.id },
        { password: password }
      );
      return res.json(userPassword);
    } else {
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Cannot change password!" });
  }
};

module.exports = resetPassword;
