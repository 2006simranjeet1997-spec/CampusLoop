
const User = require("../models/User");
const Listing = require("../models/Listing");

// ADD ITEM TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found."
      });
    }

    const user = await User.findById(req.user._id);

    if (user.wishlist.some(id => id.toString() === listingId)) {
      return res.status(400).json({
        success: false,
        message: "Item is already in your wishlist."
      });
    }

    user.wishlist.push(listingId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item added to wishlist."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET WISHLIST
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist");

    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// REMOVE ITEM FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== listingId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};
