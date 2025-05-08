// controllers/user.controller.js
const User = require("../models/user.model");
const Token = require("../models/token.model");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.registerUser = async (req, res) => {
  try {
    // Validate input
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      country: Joi.string().required(),
      password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { firstName, lastName, email, country, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "User already registered" });

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      country,
      password,
    });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    await new Token({ userId: user._id, token }).save();

    // Email link
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}&id=${user._id}`;

    // Send verification email
    await sendEmail(
      user.email,
      "Verify your email",
      `<p>Hello ${user.firstName},</p>
       <p>Please verify your email by clicking the link below:</p>
       <a href="${verifyLink}">Verify Email</a>`
    );

    res.status(201).json({ message: "Registration successful. Please verify your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.isVerified)
      return res.status(401).json({ error: "Please verify your email first" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
