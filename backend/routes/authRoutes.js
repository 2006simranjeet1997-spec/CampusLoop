
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Signup route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Change password route
router.patch("/change-password", protect, changePassword);

module.exports = router;
