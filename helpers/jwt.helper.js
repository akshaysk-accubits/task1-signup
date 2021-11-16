const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const client = require("../helpers/redis");
const User = require("../models/signup");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = { id: userId };
      console.log(payload);
      const secret = process.env.SECRET;
      const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        audience: userId,
      };
      const token = jwt.sign(payload, secret, options);
      resolve(token);
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = { id: userId };
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
      };
      const token = jwt.sign(payload, secret, options);
      console.log(token);
      client.SET(userId, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
      const options = {
        expiresIn: process.env.JWT_EXPIRE,
      };
      try {
        result = jwt.verify(token, process.env.SECRET, options);
        req.decoded = result;

        next();
      } catch (err) {
        res.status(500).json("Invalid token!");
      }
    } else {
      result = {
        error: `Authentication error. Token required.`,
        status: 401,
      };
      res.status(401).send(result);
    }
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createHttpError.Unauthorized());

          const userId = payload.id;
          console.log("user", userId);
          client.GET(userId, (err, result) => {
            if (err) {
              console.log(err.message);
              reject(createHttpError.InternalServerError());
              return;
            }
            if (refreshToken === result) return resolve(userId);
            reject(createHttpError.Unauthorized());
          });
        }
      );
    });
  },
};
