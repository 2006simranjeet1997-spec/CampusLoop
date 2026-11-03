
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

// Protected profile route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully!",
    user: req.user
  });
});

module.exports = router;
