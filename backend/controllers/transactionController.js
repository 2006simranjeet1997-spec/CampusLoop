
const Transaction = require("../models/Transaction");
const PurchaseRequest = require("../models/PurchaseRequest");
const Listing = require("../models/Listing");

// CREATE TRANSACTION
const createTransaction = async (req, res) => {
  try {
    const { purchaseRequestId, paymentMethod } = req.body;

    if (!purchaseRequestId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Purchase request and payment method are required."
      });
    }

    if (!["Demo Online", "COD"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method."
      });
    }

    const purchaseRequest = await PurchaseRequest.findById(
      purchaseRequestId
    ).populate("listing");

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: "Purchase request not found."
      });
    }

    if (purchaseRequest.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the buyer can create this transaction."
      });
    }

    if (purchaseRequest.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Purchase request must be accepted first."
      });
    }

    const existingTransaction = await Transaction.findOne({
      purchaseRequest: purchaseRequestId
    });

    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: "A transaction already exists for this purchase request."
      });
    }

    const listing = await Listing.findById(purchaseRequest.listing._id);

    if (!listing || listing.status !== "Reserved") {
      return res.status(400).json({
        success: false,
        message: "This item is not reserved for this purchase request."
      });
    }

    const transaction = await Transaction.create({
      purchaseRequest: purchaseRequest._id,
      listing: listing._id,
      buyer: purchaseRequest.buyer,
      seller: purchaseRequest.seller,
      amount: listing.price,
      paymentMethod,
      paymentStatus: "Pending",
      transactionStatus: "Payment Pending"
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully.",
      transaction
    });

  } catch (error) {
    console.error("Create Transaction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating transaction.",
      error: error.message
    });
  }
};


// SIMULATE DEMO ONLINE PAYMENT
const simulateDemoPayment = async (req, res) => {
  try {
    const { outcome } = req.body;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found."
      });
    }

    if (transaction.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the buyer can make this payment."
      });
    }

    if (transaction.paymentMethod !== "Demo Online") {
      return res.status(400).json({
        success: false,
        message: "This transaction is not using Demo Online payment."
      });
    }

    if (transaction.paymentStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been processed."
      });
    }

    if (!["success", "failure"].includes(outcome)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment outcome."
      });
    }

    if (outcome === "success") {
      transaction.paymentStatus = "Paid";
      transaction.transactionStatus = "Confirmed";
      transaction.paymentReference =
        "DEMO-" + Date.now();
    } else {
      transaction.paymentStatus = "Failed";
      transaction.transactionStatus = "Payment Pending";
    }

    await transaction.save();

    return res.status(200).json({
      success: true,
      message:
        outcome === "success"
          ? "Demo payment successful."
          : "Demo payment failed.",
      transaction
    });

  } catch (error) {
    console.error("Demo Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while processing payment.",
      error: error.message
    });
  }
};


// CONFIRM COD PAYMENT
const confirmCODPayment = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found."
      });
    }

    if (transaction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the seller can confirm COD payment."
      });
    }

    if (transaction.paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "This transaction is not using COD."
      });
    }

    if (transaction.paymentStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been processed."
      });
    }

    transaction.paymentStatus = "Paid";
    transaction.transactionStatus = "Confirmed";
    transaction.paymentReference = "COD-" + Date.now();

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "COD payment confirmed successfully.",
      transaction
    });

  } catch (error) {
    console.error("COD Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while confirming COD payment.",
      error: error.message
    });
  }
};


// COMPLETE TRANSACTION
const completeTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found."
      });
    }

    if (transaction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the seller can complete this transaction."
      });
    }

    if (transaction.paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment must be completed first."
      });
    }

    if (transaction.transactionStatus !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "Transaction must be confirmed first."
      });
    }

    const listing = await Listing.findById(transaction.listing);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found."
      });
    }

    listing.status = "Sold";
    await listing.save();

    transaction.transactionStatus = "Completed";
    transaction.completedAt = new Date();

    await transaction.save();

    await PurchaseRequest.findByIdAndUpdate(
      transaction.purchaseRequest,
      { status: "Completed" }
    );

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully.",
      transaction
    });

  } catch (error) {
    console.error("Complete Transaction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while completing transaction.",
      error: error.message
    });
  }
};


// GET MY TRANSACTIONS
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { buyer: req.user._id },
        { seller: req.user._id }
      ]
    })
      .populate("listing")
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("purchaseRequest")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error("Get Transactions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching transactions.",
      error: error.message
    });
  }
};


module.exports = {
  createTransaction,
  simulateDemoPayment,
  confirmCODPayment,
  completeTransaction,
  getMyTransactions
};
