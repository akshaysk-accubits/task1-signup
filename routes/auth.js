const router = require("express").Router();
require("../models/signup");
require("dotenv").config();
const User = require("../models/signup");
const validateToken = require("../middlewares/authentication").validateToken;
require("../middlewares/authentication");
const upload = require("../middlewares/uploadFile");
const forgotPassword = require("../controller/forgotPassword");
const Validator = require("../middlewares/validation");
const registerUser = require("../controller/registerUser");
const loginUser = require("../controller/loginUser");
const changePassword = require("../controller/changePassword");
const resetPassword = require("../controller/resetPassword");
router.post("/register", Validator("register"), registerUser);

router.post("/login", Validator("login"), loginUser);

// //forgot Password
router.post("/forgotpassword", Validator("forgotPassword"), forgotPassword);

// change password

router.put("/changePassword", Validator("changePassword"), changePassword);

//reset the password

router.put("/resetPassword", Validator("resetPassword"), resetPassword);

//check the user
router.get("/userDetails", validateToken, async (req, res) => {
  try {
    const result = req.decoded;
    let user = await User.findById(result.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get the users list {pagination}

router.get("/users", validateToken, async (req, res) => {
  try {
    let { page, size } = req.query;
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    const limit = parseInt(size);
    const skip = (page - 1) * size;
    const userId = req.decoded;
    console.log(userId);

    //list of users except the logged in user id
    const users = await User.find({ _id: { $ne: userId.id } })
      .select(["email", "firstName", "lastName", "phoneNumber"])

      .limit(limit)
      .skip(skip);

    res.send({
      page,
      size,
      data: users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get the users list

router.get("/list", validateToken, async (req, res) => {
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
    res.status(201).json({
      message: "Account Deleted",
      Delete_by: req.decoded,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//upload a file

router.post("/single", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("Single FIle upload success");
});

// Multiple Files Route Handler
router.post("/multiple", upload.array("images", 3), (req, res) => {
  console.log(req.files);
  res.send("Multiple Files Upload Success");
});

module.exports = router;
