const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../mail');
require('../models/signup');
require('dotenv').config()
const saltRounds = 10;
const User = require('../models/signup');


router.post('/register', async (req, res) => {
    let { Firstname, Lastname,email, password, date_of_birth, phonenumber} = req.body;
    if (!Firstname) {
        return res.status(400).json({message: "First name is required!"})
    }
    if (!Lastname) {
        return res.status(400).json({message: "Last name is required!"})
    }
    if (!email) {
        return res.status(400).json({message: "email is required!"})
    }
    if (!password) {
        return res.status(400).json({message: "password is required!"})
    }if (!date_of_birth) {
        return res.status(400).json({message: "date_of_birth is required!"})
    }
    if (!phonenumber) {
        return res.status(400).json({message: "phonenumber is required!"})
    }
    
    let user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({message: "Email already in use!"})
    }
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        User.create({
            Firstname,
            Lastname,
            email,
            password: hash,
            date_of_birth,
            phonenumber

        }).then(  async user => {
            await sendMail.sendMail(user.email);
            return res.json({
                 message: "User has registered successfully"
    
             })
            }).catch( err => {
            console.log('Error -> ', err);
            return res.status(403).json({
                message: 'Something went wrong!'
            })
        })
    });
    
})

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    if (!email) {
        return res.status(400).json({message: "email is required!"})
    }
    if (!password) {
        return res.status(400).json({message: "password is required!"})
    }
    let user = await User.findOne({ email })
    if (user) {
        bcrypt.compare(password, user.password, function(err, result) {
            if (result) {
                let token = jwt.sign({
                    id: user._id,
                    name: user.name
                }, process.env.SECRET)
                res.json({
                    message: "Login Successfull",
                    token
                })
            }else {
                res.status(401).json({ message: "Invalid Password or email"})
            }
        });
    }else {
        return res.status(401).json({message: "User not found!"})
    }
})

module.exports = router;