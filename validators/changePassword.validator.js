const joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const changePasswordSchema = joi.object({
  currentPassword: new PasswordComplexity({
    min: 8,
    max: 26,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  }),
});

module.exports = changePasswordSchema;
