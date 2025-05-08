// routes/user.routes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const sendEmail = require("../utils/sendEmail");

// Joi validation schema
const signupSchema = Joi.object({
  name: Joi.string().required(),
  firstName: Joi.string().required(),
  email: Joi.string().email().required(),
  country: Joi.string().required(),
  password: Joi.string().min(6).required()
});

// POST /signup
router.post("/signup", async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, firstName, email, country, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    user = new User({
      name,
      firstName,
      email,
      country,
      password: hashedPassword,
      isVerified: false,
      verificationToken
    });

    await user.save();

    const verifyLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
    await sendEmail(email, "Verify Your Email", `Click to verify: ${verifyLink}`);

    res.status(201).json({ message: "User registered. Check email to verify account." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /verify/:token
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: "Invalid verification link" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(400).json({ message: "Email not verified" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
