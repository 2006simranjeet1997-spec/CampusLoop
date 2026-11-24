const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");

// Get logged-in user's wishlist
router.get("/", protect, getMyWishlist);

// Add item to wishlist
router.post("/", protect, addToWishlist);

// Remove item from wishlist
router.delete("/:listingId", protect, removeFromWishlist);

module.exports = router;
