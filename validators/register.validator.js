const joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const registerSchema = joi.object({
  firstName: joi.string().alphanum().min(3).max(25).trim(true).required(),
  lastName: joi.string().alphanum().min(2).max(25).trim(true).required(),
  dateOfBirth: joi.string().min(3).max(2000),
  email: joi.string().email().trim(true).required(),
  password: new PasswordComplexity({
    min: 8,
    max: 26,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  }),
  phoneNumber: joi
    .string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
});

module.exports = registerSchema;
