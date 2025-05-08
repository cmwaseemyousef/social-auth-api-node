// seeders/createAdmin.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/user.model");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = "admin@example.com";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin already exists.");
      return process.exit(0);
    }

    const admin = new User({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      country: "Global",
      password: "Admin@123", // will be hashed by pre-save middleware
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    console.log("✅ Default admin created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
