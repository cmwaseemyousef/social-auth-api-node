// models/token.model.js
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // 1 hour
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
