
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createPurchaseConversation,
  createSwapConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage
} = require("../controllers/chatController");

// All chat routes require authentication
router.use(protect);

// Get all conversations
router.get("/", getMyConversations);

// Open or create a purchase conversation
router.post("/purchase/:requestId", createPurchaseConversation);

// Open or create a swap conversation
router.post("/swap/:offerId", createSwapConversation);

// Get conversation messages
router.get("/:conversationId/messages", getConversationMessages);

// Send a message
router.post("/:conversationId/messages", sendMessage);

module.exports = router;
