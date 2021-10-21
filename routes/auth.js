const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../middlewares/mail");
require("../models/signup");
require("dotenv").config();
const saltRounds = 10;
const User = require("../models/signup");
const userValidation = require("../middlewares/validation");
const loginValidation = require("../middlewares/validation");
const validateToken = require("../middlewares/jwt-helper").validateToken;
require("../middlewares/jwt-helper")
const checkUser = require("../middlewares/jwt-helper").checkUser;


router.post("/register", userValidation, async (req, res) => {
  let { firstName, lastName, email, password, dateOfBirth, phoneNumber } =
    req.body;
  const usercount = await User.countDocuments({ email });
  if (usercount > 0) {
    return res.json({ message: "email already in use!" });
  }

  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    User.create({
      firstName,
      lastName,
      email,
      password: hash,
      dateOfBirth,
      phoneNumber,
    })
      .then(async (user) => {
        await sendMail.sendMail(user.email);
        return res.json({
          message: "User has registered successfully",
        });
      })
      .catch((err) => {
        console.log("Error -> ", err);
        return res.status(403).json({
          message: "Something went wrong!",
        });
      });
  });
});

router.post("/login", loginValidation, async (req, res) => {
  let { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email is required!" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is required!" });
  }
  let user = await User.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign(
          {
            id: user._id,
            name: user.name,
          },
          process.env.SECRET
        );
        res.json({
          message: "Login Successfull",
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid Password or email" });
      }
    });
  } else {
    return res.status(401).json({ message: "User not found!" });
  }
});


//check the user
router.get("/userDetails", checkUser);



//get the users list

router.get("/list", checkUser,  async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user by Id

router.get("/:id", validateToken, async (req, res) => {
  try {
    const byId = await User.findById(req.params.id);
    res.status(200).json(byId);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get the user by phoneNumber

router.get("/:phoneNumber", validateToken, async (req, res) => {
  try {
    const userid = await User.findOne({ phoneNumber: req.params.phoneNumber });
    res.status(200).json(userid);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete the user by id

router.delete("/:id", validateToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
