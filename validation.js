const joi = require("joi");

const errorFunction = (errorBit, msg, data) => {
  if (errorBit) return { is_error: errorBit, message: msg };
  else return { is_error: errorBit, message: msg, data };
};

const validation = joi.object({
  Firstname: joi.string().alphanum().min(3).max(25).trim(true).required(),
  Lastname: joi.string().alphanum().min(3).max(25).trim(true).required(),
  date_of_birth: joi.string().min(3).max(2000),
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
  phonenumber: joi
    .string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
});
const userValidation = async (req, res, next) => {
  const payload = {
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,

    date_of_birth: req.body.date_of_birth,
    email: req.body.email,
    password: req.body.password,
    phonenumber: req.body.phonenumber,
  };

  const { error } = validation.validate(payload);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User Data : ${error.message}`)
    );
  } else {
    next();
  }
};
module.exports = userValidation;
