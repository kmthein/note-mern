const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

const { body } = require("express-validator");

const User = require("../models/user");

const bcrypt = require("bcrypt");

router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username is too short.")
      .isLength({ max: 10 })
      .withMessage("Username is too long.")
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject("Username is already existed.");
          }
        });
      }),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email is already existed.");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password is too short."),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter valid email.")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password is too short."),
  ],
  authController.login
);

router.get("/status", authController.checkStatus);

module.exports = router;
