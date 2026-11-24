
const mongoose = require("mongoose");

const swapOfferSchema = new mongoose.Schema(
  {
    requestedListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },

    offeredListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },

    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    listingOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    requestedPrice: {
      type: Number,
      required: true,
      min: 0
    },

    offeredPrice: {
      type: Number,
      required: true,
      min: 0
    },

    priceDifference: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    paymentDueFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    paymentMethod: {
      type: String,
      enum: ["Demo Online", "COD"],
      default: null
    },

    paymentStatus: {
      type: String,
      enum: ["NotRequired", "Pending", "Paid"],
      default: "NotRequired"
    },

    paymentReference: {
      type: String,
      default: ""
    },

    offeredByConfirmed: {
      type: Boolean,
      default: false
    },

    listingOwnerConfirmed: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Cancelled",
        "Completed"
      ],
      default: "Pending"
    },

    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const SwapOffer = mongoose.model("SwapOffer", swapOfferSchema);

module.exports = SwapOffer;
