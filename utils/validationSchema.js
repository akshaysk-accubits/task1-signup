const validation = require("../middlewares/validation").validation;
//const validation = require("../middlewares/validation");
const payload = require("../middlewares/validation").payload;
const joi = require("joi");



const { error } = validation.validate(payload);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User Data : ${error.message}`)
    );
  } else {
    next();
  
};


const errorFunction = (errorBit, msg, data) => {
  if (errorBit) return { is_error: errorBit, message: msg };
  else return { is_error: errorBit, message: msg, data };
};