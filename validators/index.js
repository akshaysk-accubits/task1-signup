const register = require("./register.validator");
const login = require("./login.validator");
const changePassword = require("../validators/changePassword.validator");
const forgotPassword = require("../validators/forgotPassword.validator");
const resetPassword = require("../validators/resetPassword.validator");

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword
};
