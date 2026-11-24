
const SwapOffer = require("../models/SwapOffer");
const Listing = require("../models/Listing");

// CREATE SWAP OFFER
const createSwapOffer = async (req, res) => {
  try {
    const { requestedListingId, offeredListingId, message } = req.body;

    if (!requestedListingId || !offeredListingId) {
      return res.status(400).json({
        success: false,
        message: "Both listing IDs are required."
      });
    }

    if (requestedListingId === offeredListingId) {
      return res.status(400).json({
        success: false,
        message: "You cannot swap an item with itself."
      });
    }

    const requestedListing = await Listing.findById(requestedListingId);
    const offeredListing = await Listing.findById(offeredListingId);

    if (!requestedListing || !offeredListing) {
      return res.status(404).json({
        success: false,
        message: "One or both listings were not found."
      });
    }

    if (
      requestedListing.listingType !== "Swap" ||
      offeredListing.listingType !== "Swap"
    ) {
      return res.status(400).json({
        success: false,
        message: "Both listings must be available for swapping."
      });
    }

    if (
      requestedListing.status !== "Available" ||
      offeredListing.status !== "Available"
    ) {
      return res.status(400).json({
        success: false,
        message: "Both items must be available."
      });
    }

    if (offeredListing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only offer your own listing."
      });
    }

    if (requestedListing.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot make an offer on your own listing."
      });
    }

    // Prevent active offers involving either listing
    const existingOffer = await SwapOffer.findOne({
      status: { $in: ["Pending", "Accepted"] },
      $or: [
        { requestedListing: requestedListingId },
        { offeredListing: requestedListingId },
        { requestedListing: offeredListingId },
        { offeredListing: offeredListingId }
      ]
    });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "One of these items already has an active swap offer."
      });
    }

    const requestedPrice = requestedListing.price || 0;
    const offeredPrice = offeredListing.price || 0;

    const priceDifference = Math.abs(
      requestedPrice - offeredPrice
    );

    let paymentDueFrom = null;

    if (offeredPrice < requestedPrice) {
      paymentDueFrom = req.user._id;
    } else if (requestedPrice < offeredPrice) {
      paymentDueFrom = requestedListing.seller;
    }

    const swapOffer = await SwapOffer.create({
      requestedListing: requestedListingId,
      offeredListing: offeredListingId,
      offeredBy: req.user._id,
      listingOwner: requestedListing.seller,
      requestedPrice,
      offeredPrice,
      priceDifference,
      paymentDueFrom,
      paymentStatus:
        priceDifference === 0 ? "NotRequired" : "Pending",
      status: "Pending",
      message: message || ""
    });

    return res.status(201).json({
      success: true,
      message: "Swap offer sent successfully.",
      swapOffer
    });

  } catch (error) {
    console.error("Create Swap Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating swap offer.",
      error: error.message
    });
  }
};


// GET MY OUTGOING SWAP OFFERS
const getMySwapOffers = async (req, res) => {
  try {
    const offers = await SwapOffer.find({
      offeredBy: req.user._id
    })
      .populate("requestedListing")
      .populate("offeredListing")
      .populate("listingOwner", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: offers.length,
      offers
    });

  } catch (error) {
    console.error("Get My Swap Offers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching swap offers.",
      error: error.message
    });
  }
};


// GET RECEIVED SWAP OFFERS
const getReceivedSwapOffers = async (req, res) => {
  try {
    const offers = await SwapOffer.find({
      listingOwner: req.user._id
    })
      .populate("requestedListing")
      .populate("offeredListing")
      .populate("offeredBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: offers.length,
      offers
    });

  } catch (error) {
    console.error("Get Received Swap Offers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching received offers.",
      error: error.message
    });
  }
};


// CANCEL SWAP OFFER
const cancelSwapOffer = async (req, res) => {
  try {
    const offer = await SwapOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Swap offer not found."
      });
    }

    if (offer.offeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the person who sent the offer can cancel it."
      });
    }

    if (offer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending offers can be cancelled."
      });
    }

    offer.status = "Cancelled";
    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Swap offer cancelled successfully.",
      offer
    });

  } catch (error) {
    console.error("Cancel Swap Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while cancelling swap offer.",
      error: error.message
    });
  }
};


// ACCEPT OR REJECT SWAP OFFER
const updateSwapOffer = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Accepted or Rejected."
      });
    }

    const offer = await SwapOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Swap offer not found."
      });
    }

    if (offer.listingOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the listing owner can update this offer."
      });
    }

    if (offer.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This offer has already been processed."
      });
    }

    if (status === "Rejected") {
      offer.status = "Rejected";
      await offer.save();

      return res.status(200).json({
        success: true,
        message: "Swap offer rejected.",
        offer
      });
    }

    const requestedListing = await Listing.findById(
      offer.requestedListing
    );

    const offeredListing = await Listing.findById(
      offer.offeredListing
    );

    if (
      !requestedListing ||
      !offeredListing ||
      requestedListing.status !== "Available" ||
      offeredListing.status !== "Available"
    ) {
      return res.status(400).json({
        success: false,
        message: "One or both items are no longer available."
      });
    }

    requestedListing.status = "Reserved";
    offeredListing.status = "Reserved";

    await requestedListing.save();
    await offeredListing.save();

    offer.status = "Accepted";
    await offer.save();

    // Reject other pending offers involving either item
    await SwapOffer.updateMany(
      {
        _id: { $ne: offer._id },
        status: "Pending",
        $or: [
          { requestedListing: offer.requestedListing },
          { offeredListing: offer.requestedListing },
          { requestedListing: offer.offeredListing },
          { offeredListing: offer.offeredListing }
        ]
      },
      { status: "Rejected" }
    );

    return res.status(200).json({
      success: true,
      message: "Swap offer accepted. Both items are reserved.",
      offer
    });

  } catch (error) {
    console.error("Update Swap Offer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating swap offer.",
      error: error.message
    });
  }
};


// SELECT PAYMENT METHOD
const selectSwapPaymentMethod = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    if (!["Demo Online", "COD"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Select Demo Online or COD."
      });
    }

    const offer = await SwapOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Swap offer not found."
      });
    }

    if (offer.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "The swap offer must be accepted first."
      });
    }

    if (!offer.paymentDueFrom) {
      return res.status(400).json({
        success: false,
        message: "No additional payment is required."
      });
    }

    if (offer.paymentDueFrom.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the person paying the price difference can select payment."
      });
    }

    if (offer.paymentStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Payment is not pending."
      });
    }

    offer.paymentMethod = paymentMethod;
    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Swap payment method selected.",
      offer
    });

  } catch (error) {
    console.error("Select Swap Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while selecting payment method.",
      error: error.message
    });
  }
};


// SIMULATE DEMO ONLINE SWAP PAYMENT
const simulateSwapDemoPayment = async (req, res) => {
  try {
    const { outcome } = req.body;

    const offer = await SwapOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Swap offer not found."
      });
    }

    if (offer.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "The swap offer must be accepted first."
      });
    }

    // Safety check: ensure a payer exists before comparing IDs
    if (
      !offer.paymentDueFrom ||
      offer.paymentDueFrom.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the person paying the difference can make this payment."
      });
    }

    if (offer.paymentMethod !== "Demo Online") {
      return res.status(400).json({
        success: false,
        message: "This swap is not using Demo Online payment."
      });
    }

    if (offer.paymentStatus !== "Pending") {
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
      offer.paymentStatus = "Paid";
      offer.paymentReference = "SWAP-DEMO-" + Date.now();
    }

    await offer.save();

    return res.status(200).json({
      success: true,
      message:
        outcome === "success"
          ? "Demo swap payment successful."
          : "Demo swap payment failed.",
      offer
    });

  } catch (error) {
    console.error("Swap Demo Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while processing swap payment.",
      error: error.message
    });
  }
};


// CONFIRM COD SWAP PAYMENT
const confirmCODSwapPayment = async (req, res) => {
  try {
    const offer = await SwapOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Swap offer not found."
      });
    }

    if (offer.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "The swap offer must be accepted first."
      });
    }

    if (offer.paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "This swap is not using COD."
      });
    }

    if (offer.paymentStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been processed."
      });
    }

    if (!offer.paymentDueFrom) {
      return res.status(400).json({
        success: false,
        message: "No additional payment is required."
      });
    }

    // The person receiving the money confirms its receipt
    const paymentReceiver =
      offer.paymentDueFrom.toString() === offer.offeredBy.toString()
        ? offer.listingOwner
        : offer.offeredBy;

    if (paymentReceiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the person receiving the payment can confirm it."
      });
    }

    offer.paymentStatus = "Paid";
    offer.paymentReference = "SWAP-COD-" + Date.now();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "COD payment confirmed successfully.",
      offer
    });

  } catch (error) {
    console.error("Swap COD Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while confirming COD payment.",
      error: error.message
    });
  }
};


// CONFIRM ITEM HANDOVER
const confirmSwapHandover = async (req, res) => {
  try {
    const offer = await SwapOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Swap offer not found."
      });
    }

    if (offer.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted swap offers can be completed."
      });
    }

    if (
      offer.paymentStatus !== "NotRequired" &&
      offer.paymentStatus !== "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete the additional payment before confirming handover."
      });
    }

    const userId = req.user._id.toString();

    if (offer.offeredBy.toString() === userId) {
      offer.offeredByConfirmed = true;
    } else if (offer.listingOwner.toString() === userId) {
      offer.listingOwnerConfirmed = true;
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not part of this swap."
      });
    }

    if (
      offer.offeredByConfirmed &&
      offer.listingOwnerConfirmed
    ) {
      const requestedListing = await Listing.findById(
        offer.requestedListing
      );

      const offeredListing = await Listing.findById(
        offer.offeredListing
      );

      if (!requestedListing || !offeredListing) {
        return res.status(404).json({
          success: false,
          message: "One or both listings could not be found."
        });
      }

      if (
        requestedListing.status !== "Reserved" ||
        offeredListing.status !== "Reserved"
      ) {
        return res.status(400).json({
          success: false,
          message: "Both listings must be reserved to complete the swap."
        });
      }

      requestedListing.status = "Swapped";
      offeredListing.status = "Swapped";

      await requestedListing.save();
      await offeredListing.save();

      offer.status = "Completed";
      offer.completedAt = new Date();
    }

    await offer.save();

    return res.status(200).json({
      success: true,
      message:
        offer.status === "Completed"
          ? "Exchange completed successfully. Both listings are now swapped."
          : "Your handover confirmation has been saved. Waiting for the other user.",
      offer
    });

  } catch (error) {
    console.error("Confirm Swap Handover Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while confirming swap handover.",
      error: error.message
    });
  }
};


module.exports = {
  createSwapOffer,
  getMySwapOffers,
  getReceivedSwapOffers,
  cancelSwapOffer,
  updateSwapOffer,
  selectSwapPaymentMethod,
  simulateSwapDemoPayment,
  confirmCODSwapPayment,
  confirmSwapHandover
};
