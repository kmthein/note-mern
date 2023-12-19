const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");

const User = require("../models/user");

const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Something went wrong.",
      errorDetails: errors.array(),
    });
  }
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10).then((hashedPassword) => {
    return User.create({
      username,
      email,
      password: hashedPassword,
    })
      .then((result) => {
        res.status(201).json("User successfully created.");
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json("Something went wrong.");
      });
  });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Something went wrong.",
      errorDetails: errors.array(),
    });
  }
  const { email, password } = req.body;
  return User.findOne({ email }).then((user) => {
    if(user) {
        bcrypt.compare(password, user.password).then((isMatch) => {
            if(!isMatch) {
                throw new Error("Wrong email or password.");
            } else {
                const token = jwt.sign({email: user.email, userId: user._id}, process.env.JWT_KEY, { expiresIn: "1h" })
                return res.status(200).json({token, userId: user._id, message: "Login successful."})
            }
        }).catch((err) => {
            return res.status(422).json({
                message: err.message
            });        
        })
    } else {
        throw new Error("User not found with this email.")
    }
  }).catch((err) => {
    return res.status(422).json({
        message: err.message
    });
  });
};
