const mongoose = require("mongoose");
const validator = require("validator");
const loginSchema = new mongoose.Schema({
  Firstname: {
    type: String,
    require: true,
    min: 3,
    max: 20,
  },
  Lastname: {
    type: String,
    require: true,
    min: 3,
    max: 20,
  },
  date_of_birth: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  phonenumber: {
    type: Number,
    required: true,
    //max:11,
  },
});

module.exports = mongoose.model("signup", loginSchema);
