
const Listing = require("../models/Listing");

// CREATE LISTING
const createListing = async (req, res) => {
  try {
    const {
      itemName,
      category,
      listingType,
      price,
      condition,
      description,
      imageUrl
    } = req.body;

    const listing = await Listing.create({
      itemName,
      category,
      listingType,
      price,
      condition,
      description,
      imageUrl,
      seller: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Listing created successfully!",
      listing
    });

  } catch (error) {
    console.error("Create listing error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create listing."
    });
  }
};

// GET ALL LISTINGS
const getAllListings = async (req, res) => {
  try {
    const { category, listingType, search } = req.query;

    const filter = {
      status: "Available"
    };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (listingType && listingType !== "All") {
      filter.listingType = listingType;
    }

    if (search) {
      filter.itemName = {
        $regex: search,
        $options: "i"
      };
    }

    const listings = await Listing.find(filter)
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });

  } catch (error) {
    console.error("Get listings error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch listings."
    });
  }
};

// GET SINGLE LISTING
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("seller", "name email");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found."
      });
    }

    res.status(200).json({
      success: true,
      listing
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid listing ID."
    });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById
};
