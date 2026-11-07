
const mongoose = require("mongoose");
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
  
      // Get uploaded image URL
      const uploadedImageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : imageUrl || "";
  
      const listing = await Listing.create({
        itemName,
        category,
        listingType,
        price,
        condition,
        description,
        imageUrl: uploadedImageUrl,
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID."
      });
    }

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

// CHECK LISTING OWNERSHIP
const getOwnedListing = async (listingId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return null;
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    return null;
  }

  if (listing.seller.toString() !== userId.toString()) {
    return false;
  }

  return listing;
};

// UPDATE LISTING

const updateListing = async (req, res) => {
    try {
      const listing = await getOwnedListing(
        req.params.id,
        req.user._id
      );
  
      if (listing === null) {
        return res.status(404).json({
          success: false,
          message: "Listing not found."
        });
      }
  
      if (listing === false) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to edit this listing."
        });
      }
  
      const allowedFields = [
        "itemName",
        "category",
        "listingType",
        "price",
        "condition",
        "description"
      ];
  
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          listing[field] = req.body[field];
        }
      });
  
      // Replace image only if a new image is uploaded
      if (req.file) {
        listing.imageUrl = `/uploads/${req.file.filename}`;
      }
  
      const updatedListing = await listing.save();
  
      res.status(200).json({
        success: true,
        message: "Listing updated successfully!",
        listing: updatedListing
      });
  
    } catch (error) {
      console.error("Update listing error:", error.message);
  
      res.status(400).json({
        success: false,
        message: "Failed to update listing."
      });
    }
  };
  

// UPDATE LISTING STATUS
const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Available",
      "Sold",
      "Unavailable"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing status."
      });
    }

    const listing = await getOwnedListing(
      req.params.id,
      req.user._id
    );

    if (listing === null) {
      return res.status(404).json({
        success: false,
        message: "Listing not found."
      });
    }

    if (listing === false) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this listing."
      });
    }

    listing.status = status;

    await listing.save();

    res.status(200).json({
      success: true,
      message: `Listing marked as ${status}.`,
      listing
    });

  } catch (error) {
    console.error("Status update error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to update listing status."
    });
  }
};

// DELETE LISTING
const deleteListing = async (req, res) => {
  try {
    const listing = await getOwnedListing(
      req.params.id,
      req.user._id
    );

    if (listing === null) {
      return res.status(404).json({
        success: false,
        message: "Listing not found."
      });
    }

    if (listing === false) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this listing."
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully!"
    });

  } catch (error) {
    console.error("Delete listing error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete listing."
    });
  }
};


// GET MY LISTINGS
const getMyListings = async (req, res) => {
    try {
      const listings = await Listing.find({
        seller: req.user._id
      })
        .populate("seller", "name email")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: listings.length,
        listings
      });
    } catch (error) {
      console.error("Get my listings error:", error.message);
  
      res.status(500).json({
        success: false,
        message: "Failed to fetch your listings."
      });
    }
  };
  

  module.exports = {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    updateListingStatus,
    deleteListing,
    getMyListings
  };
