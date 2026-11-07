
const PurchaseRequest = require("../models/PurchaseRequest");
const Listing = require("../models/Listing");

// BUYER: CREATE PURCHASE REQUEST
const createPurchaseRequest = async (req, res) => {
  try {
    const { listingId, message } = req.body;

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

    if (listing.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This item is no longer available."
      });
    }

    if (listing.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own listing."
      });
    }

    const existingRequest = await PurchaseRequest.findOne({
      listing: listingId,
      buyer: req.user._id,
      status: "Pending"
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending request for this item."
      });
    }

    const purchaseRequest = await PurchaseRequest.create({
      listing: listingId,
      buyer: req.user._id,
      seller: listing.seller,
      message: message || ""
    });

    res.status(201).json({
      success: true,
      message: "Purchase request sent successfully!",
      request: purchaseRequest
    });

  } catch (error) {
    console.error("Create purchase request error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send purchase request."
    });
  }
};


// BUYER: GET MY PURCHASE REQUESTS
const getMyPurchaseRequests = async (req, res) => {
  try {
    const requests = await PurchaseRequest.find({
      buyer: req.user._id
    })
      .populate("listing")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error("Get buyer requests error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase requests."
    });
  }
};


// SELLER: GET REQUESTS RECEIVED
const getSellerPurchaseRequests = async (req, res) => {
  try {
    const requests = await PurchaseRequest.find({
      seller: req.user._id
    })
      .populate("listing")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error("Get seller requests error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seller requests."
    });
  }
};


// SELLER: ACCEPT OR REJECT REQUEST
const updatePurchaseRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request status."
      });
    }

    const request = await PurchaseRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Purchase request not found."
      });
    }

    if (request.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this request."
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed."
      });
    }

    const listing = await Listing.findById(request.listing);

    if (!listing || listing.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This item is no longer available."
      });
    }

    request.status = status;
    await request.save();

    // If accepted, mark item as sold
    if (status === "Accepted") {
      listing.status = "Sold";
      await listing.save();

      // Reject other pending requests for this item
      await PurchaseRequest.updateMany(
        {
          listing: listing._id,
          _id: { $ne: request._id },
          status: "Pending"
        },
        {
          $set: { status: "Rejected" }
        }
      );
    }

    res.status(200).json({
      success: true,
      message: `Purchase request ${status.toLowerCase()} successfully.`,
      request
    });

  } catch (error) {
    console.error("Update purchase request error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update purchase request."
    });
  }
};


module.exports = {
  createPurchaseRequest,
  getMyPurchaseRequests,
  getSellerPurchaseRequests,
  updatePurchaseRequest
};
