// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// Admin-only route to add another admin
router.post("/add", auth, isAdmin, adminController.addAdmin);

module.exports = router;
