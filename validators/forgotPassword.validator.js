const joi = require("joi");

const forgotPasswordSchema = joi.object({
  email: joi.string().email().trim(true).required(),
});

module.exports = forgotPasswordSchema;
