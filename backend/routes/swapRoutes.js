
const express = require("express");
const router = express.Router();

const {
  createSwapOffer,
  getMySwapOffers,
  getReceivedSwapOffers,
  cancelSwapOffer,
  updateSwapOffer,
  selectSwapPaymentMethod,
  simulateSwapDemoPayment,
  confirmCODSwapPayment,
  confirmSwapHandover
} = require("../controllers/swapController");

const protect = require("../middleware/authMiddleware");

// Create a swap offer
router.post("/", protect, createSwapOffer);

// Get my outgoing swap offers
router.get("/my", protect, getMySwapOffers);

// Get received swap offers
router.get("/received", protect, getReceivedSwapOffers);

// Cancel a pending swap offer
router.patch("/:id/cancel", protect, cancelSwapOffer);

// Accept or reject a swap offer
router.patch("/:id", protect, updateSwapOffer);

// Select payment method
router.patch("/:id/payment-method", protect, selectSwapPaymentMethod);

// Simulate Demo Online payment
router.post("/:id/demo-payment", protect, simulateSwapDemoPayment);

// Confirm COD payment
router.patch("/:id/confirm-cod", protect, confirmCODSwapPayment);

// Confirm item handover
router.patch("/:id/confirm-handover", protect, confirmSwapHandover);

module.exports = router;
