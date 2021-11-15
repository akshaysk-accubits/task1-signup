const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const nodemailer =require("nodemailer");
const morgan = require("morgan");
require('dotenv').config()

const app = express();
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./models/signup')

app.use('/authentication',require('./routes/auth'))
app.use('/refresh',require('./routes/auth.Route'))


//connect to DB
mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.log(" err ", err);
      } else console.log("Connected to DB");
    }
  );

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Error ', err);
    }
    console.log('Node.js is running at PORT',process.env.PORT)})