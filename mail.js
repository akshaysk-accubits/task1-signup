var nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
require('./models/signup');
require('./routes/auth');


const auth = {
  auth: {
      api_key: process.env.API_KEY || '41ea30bf45290735882df6bdbdfca6d0-443ec20e-b8cc7745' , 
      domain: process.env.DOMAIN || 'sandbox047ca4fc822540ee9b30b9a23e7d13c6.mailgun.org' 
  }
};

const transporter = nodemailer.createTransport(mailGun(auth));


async function sendMail(email) {
  var mailOptions = {
  from: 'ask28696@gmail.com',
  to: email,
  subject: 'Sending Email using Node.js',
  text: 'Welcome home !'
};

transporter.sendMail(mailOptions,  function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports.sendMail=sendMail;