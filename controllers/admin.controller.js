// controllers/admin.controller.js
const User = require("../models/user.model");
const Joi = require("joi");

exports.addAdmin = async (req, res) => {
  try {
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

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "Email already exists" });

    const admin = new User({
      firstName,
      lastName,
      email,
      country,
      password,
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    res.status(201).json({ message: "New admin created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
