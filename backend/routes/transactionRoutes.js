
const express = require("express");
const router = express.Router();

const {
  createTransaction,
  simulateDemoPayment,
  confirmCODPayment,
  completeTransaction,
  getMyTransactions
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

// Buyer: Create a transaction
router.post("/", protect, createTransaction);

// Buyer / Seller: View their transactions
router.get("/my", protect, getMyTransactions);

// Buyer: Simulate demo online payment
router.patch("/:id/demo-payment", protect, simulateDemoPayment);

// Seller: Confirm COD cash received
router.patch("/:id/confirm-cod", protect, confirmCODPayment);

// Seller: Complete transaction after handover
router.patch("/:id/complete", protect, completeTransaction);

module.exports = router;
