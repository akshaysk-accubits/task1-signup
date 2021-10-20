const { string } = require("joi");
const mongoose = require("mongoose");
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
  DateofBirth: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  phonenumber: {
    type: String,
    required: true,
    //max:11,
  },
});

module.exports = mongoose.model("signup", loginSchema);
