
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Books",
        "Study Materials",
        "Accessories",
        "Others"
      ]
    },

    listingType: {
      type: String,
      required: true,
      enum: ["Sell", "Rent", "Borrow", "Swap"]
    },

    price: {
      type: Number,
      default: 0,
      min: 0
    },

    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair"]
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    imageUrl: {
      type: String,
      default: ""
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["Available", "Sold", "Unavailable"],
      default: "Available"
    }
  },
  {
    timestamps: true
  }
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
