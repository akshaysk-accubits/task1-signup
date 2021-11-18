const express = require('express')
const router = require("express").Router();
const AuthController = require('../controller/authController')
const Validator = require("../middlewares/validation");

router.post("/register", Validator("register"), AuthController.register);

router.post("/login", Validator("login"), AuthController.login);

router.post("/refresh-token", AuthController.refreshToken)


module.exports = router;
