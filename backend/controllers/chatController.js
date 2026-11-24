
const mongoose = require("mongoose");

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const PurchaseRequest = require("../models/PurchaseRequest");
const SwapOffer = require("../models/SwapOffer");

// HELPER: CHECK WHETHER USER IS A CONVERSATION PARTICIPANT
const isParticipant = (conversation, userId) => {
  return conversation.participants.some(
    (participant) => participant.toString() === userId.toString()
  );
};

// HELPER: VALIDATE MONGODB ID
const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


// CREATE OR GET PURCHASE CONVERSATION
const createPurchaseConversation = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    if (!isValidId(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid purchase request ID."
      });
    }

    const request = await PurchaseRequest.findById(requestId)
      .populate("listing", "itemName imageUrl");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Purchase request not found."
      });
    }

    if (request.status !== "Accepted" && request.status !== "Completed") {
      return res.status(403).json({
        success: false,
        message: "Chat is available only after the purchase request is accepted."
      });
    }

    const buyerId = request.buyer.toString();
    const sellerId = request.seller.toString();

    if (
      userId.toString() !== buyerId &&
      userId.toString() !== sellerId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this purchase."
      });
    }

    let conversation = await Conversation.findOne({
      type: "Purchase",
      purchaseRequest: request._id
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [request.buyer, request.seller],
        type: "Purchase",
        purchaseRequest: request._id,
        listing: request.listing._id
      });
    }

    conversation = await Conversation.findById(conversation._id)
      .populate("participants", "name profileImage")
      .populate("listing", "itemName imageUrl");

    return res.status(200).json({
      success: true,
      message: "Purchase conversation ready.",
      conversation
    });

  } catch (error) {
    console.error("Create Purchase Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to open purchase conversation."
    });
  }
};


// CREATE OR GET SWAP CONVERSATION
const createSwapConversation = async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.user._id;

    if (!isValidId(offerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid swap offer ID."
      });
    }

    const offer = await SwapOffer.findById(offerId)
      .populate("requestedListing", "itemName imageUrl");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Swap offer not found."
      });
    }

    if (offer.status !== "Accepted" && offer.status !== "Completed") {
      return res.status(403).json({
        success: false,
        message: "Chat is available only after the swap offer is accepted."
      });
    }

    const offeredById = offer.offeredBy.toString();
    const listingOwnerId = offer.listingOwner.toString();

    if (
      userId.toString() !== offeredById &&
      userId.toString() !== listingOwnerId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this swap."
      });
    }

    let conversation = await Conversation.findOne({
      type: "Swap",
      swapOffer: offer._id
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [offer.offeredBy, offer.listingOwner],
        type: "Swap",
        swapOffer: offer._id,
        listing: offer.requestedListing._id
      });
    }

    conversation = await Conversation.findById(conversation._id)
      .populate("participants", "name profileImage")
      .populate("listing", "itemName imageUrl");

    return res.status(200).json({
      success: true,
      message: "Swap conversation ready.",
      conversation
    });

  } catch (error) {
    console.error("Create Swap Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to open swap conversation."
    });
  }
};


// GET ALL MY CONVERSATIONS
const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate("participants", "name profileImage")
      .populate("listing", "itemName imageUrl")
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: conversations.length,
      conversations
    });

  } catch (error) {
    console.error("Get Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations."
    });
  }
};


// GET MESSAGES OF A CONVERSATION
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!isValidId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID."
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found."
      });
    }

    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this conversation."
      });
    }

    const messages = await Message.find({
      conversation: conversationId
    })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });

  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages."
    });
  }
};


// SEND MESSAGE + BROADCAST THROUGH SOCKET.IO
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!isValidId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID."
      });
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty."
      });
    }

    if (text.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 2000 characters."
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found."
      });
    }

    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot send messages in this conversation."
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim(),
      readBy: [req.user._id]
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();

    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name profileImage");

    // GET SOCKET.IO INSTANCE
    const io = req.app.get("io");

    // BROADCAST MESSAGE TO EVERYONE IN THIS CONVERSATION ROOM
    if (io) {
      io.to(conversationId).emit("newMessage", populatedMessage);
    } else {
      console.warn("Socket.IO instance not found. Message was saved, but not broadcast.");
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      newMessage: populatedMessage
    });

  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message."
    });
  }
};


module.exports = {
  createPurchaseConversation,
  createSwapConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage
};
