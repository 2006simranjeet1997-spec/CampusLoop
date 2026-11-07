
const express = require("express");
const router = express.Router();

const {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    updateListingStatus,
    deleteListing,
    getMyListings
  } = require("../controllers/listingController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.get("/my", protect, getMyListings);

// Get all listings
router.get("/", getAllListings);

// Create a listing
router.post("/", protect, upload.single("image"), createListing);

// Update listing status
router.patch("/:id/status", protect, updateListingStatus);

// Edit listing
router.put("/:id", protect, upload.single("image"), updateListing);

// Delete listing
router.delete("/:id", protect, deleteListing);

// Get a single listing
router.get("/:id", getListingById);

module.exports = router;
