
const Wishlist = require("../models/Wishlist");
const Listing = require("../models/Listing");

// ADD ITEM TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const { listingId } = req.body;
    const userId = req.user._id;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: "Listing ID is required."
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found."
      });
    }

    const existingItem = await Wishlist.findOne({
      user: userId,
      listing: listingId
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Item is already in your wishlist."
      });
    }

    const wishlistItem = await Wishlist.create({
      user: userId,
      listing: listingId
    });

    res.status(201).json({
      success: true,
      message: "Item added to wishlist successfully.",
      wishlistItem
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Item is already in your wishlist."
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add item to wishlist.",
      error: error.message
    });
  }
};


// GET LOGGED-IN USER'S WISHLIST
const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id
    })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist.",
      error: error.message
    });
  }
};


// REMOVE ITEM FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;

    const wishlistItem = await Wishlist.findOneAndDelete({
      user: req.user._id,
      listing: listingId
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove item from wishlist.",
      error: error.message
    });
  }
};


module.exports = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist
};
