
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require("../controllers/userController");

// Protected profile route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully!",
    user: req.user
  });
});

// Wishlist routes
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:listingId", protect, addToWishlist);
router.delete("/wishlist/:listingId", protect, removeFromWishlist);

module.exports = router;
