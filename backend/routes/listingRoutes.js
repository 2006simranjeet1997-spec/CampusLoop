
const express = require("express");
const router = express.Router();

const {
  createListing,
  getAllListings,
  getListingById
} = require("../controllers/listingController");

const protect = require("../middleware/authMiddleware");

// Get all listings
router.get("/", getAllListings);

// Get a single listing
router.get("/:id", getListingById);

// Create a listing (login required)
router.post("/", protect, createListing);

module.exports = router;

