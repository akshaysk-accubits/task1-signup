const createHttpError = require("http-errors");
const User = require("../models/signup");
const client = require("../helpers/redis");
const sendMail = require("../middlewares/mail").sendMail;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require('../helpers/jwt.helper')

module.exports = {
  register: async (req, res, next) => {
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
  },

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ message: "email is required!" });
      }
      if (!password) {
        return res.status(400).json({ message: "password is required!" });
      }
      let user = await User.findOne({ email });
      if (!user) throw createHttpError.NotFound("User not registered");
      if (user) {
        
        const result = await bcrypt.compare(password, user.password);
        
          if (result) {
            //console.log(result);
            const accessToken = await signAccessToken(user.id);
            //console.log(accessToken);
            const refreshToken = await signRefreshToken(user.id);
            res.status(200).json({message: "Login successfull!", accessToken, refreshToken});
            // console.log(accessToken);
            // console.log(refreshToken);

            /////////////////////////////
            // client.set(
            //   `${newRefreshToken}`,
            //   JSON.stringify({
            //     refreshToken: refreshToken,
            //     user_id: user._id,
            //   }))
            




          } else {
            return next(createHttpError.BadRequest('Invalid Username/Password'));
          }
        
      }
    } catch (error) {
      next(error);
    }},
  

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      // console.log(refreshToken);
      if (!refreshToken) throw createHttpError.BadRequest();
      // const user = await User.findOne({ refreshToken });
      const userId = await verifyRefreshToken(refreshToken);
      // console.log(user);
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },
}

