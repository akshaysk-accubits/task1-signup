const joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const resetPasswordSchema = joi.object({
  password: new PasswordComplexity({
    min: 8,
    max: 26,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  }),
});

module.exports = resetPasswordSchema;
