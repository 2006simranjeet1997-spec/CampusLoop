
const express = require("express");
const router = express.Router();

const {
  createPurchaseRequest,
  getMyPurchaseRequests,
  getSellerPurchaseRequests,
  updatePurchaseRequest,
  cancelPurchaseRequest
} = require("../controllers/purchaseRequestController");

const protect = require("../middleware/authMiddleware");

// Buyer: Send purchase request
router.post("/", protect, createPurchaseRequest);

// Buyer: View their requests
router.get("/my", protect, getMyPurchaseRequests);

// Buyer: Cancel pending purchase request
router.patch("/:id/cancel", protect, cancelPurchaseRequest);

// Seller: View requests received
router.get("/received", protect, getSellerPurchaseRequests);

// Seller: Accept or reject request
router.patch("/:id", protect, updatePurchaseRequest);

module.exports = router;
