const joi = require("joi");

const errorFunction = (errorBit, msg, data) => {
  if (errorBit) return { is_error: errorBit, message: msg };
  else return { is_error: errorBit, message: msg, data };
};

const validation = joi.object({
  firstName: joi.string().alphanum().min(3).max(25).trim(true).required(),
  lastName: joi.string().alphanum().min(2).max(25).trim(true).required(),
  dateOfBirth: joi.string().min(3).max(2000),
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
  phoneNumber: joi
    .string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
});

const logValidation = joi.object({
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
});

const userValidation = async (req, res, next) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,

    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
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

const loginValidation = async (req, res, next) => {
  const payload = {

    email: req.body.email,
    password: req.body.password,
  };
  const { error } = logValidation.validate(payload);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Invalid email or password : ${error.message}`)
    );
  } else {
    next();
  }
};
module.exports = userValidation;
module.exports = loginValidation;

