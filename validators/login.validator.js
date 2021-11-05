const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
});

module.exports = loginSchema;
