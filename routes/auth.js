const { required, valid } = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user account
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) return res.status(400).send("Email already exist");

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name: name,
    email: email,
    password: hashPassword,
  });
  try {
    const newUser = await user.save();
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login in to a user account.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or Password are incorrect");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send("Email or Password are incorrect");

  // Create and assing a token,

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
