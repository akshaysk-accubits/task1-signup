const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const nodemailer =require("nodemailer");
require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./models/signup')

app.use('/authentication',require('./routes/auth'))


// const signupsRoute = require("./routes/signups");
// app.use('/signups',signupsRoute);


mongoose.connect("mongodb://localhost:27017/login");
mongoose.set("debug",true);
console.log("DB Connected");

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Error ', err);
    }
    console.log('Node.js is running at PORT',process.env.PORT)})