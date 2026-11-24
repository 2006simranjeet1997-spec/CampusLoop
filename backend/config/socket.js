
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");
const Conversation = require("../models/Conversation");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Authenticate every socket connection using JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required."));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("_id");

      if (!user) {
        return next(new Error("User not found."));
      }

      socket.userId = user._id.toString();

      next();
    } catch (error) {
      next(new Error("Invalid or expired token."));
    }
  });

  io.on("connection", (socket) => {
    console.log("Chat user connected:", socket.userId);

    // Join only conversations where the user is a participant
    socket.on("joinConversation", async (conversationId) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
          socket.emit("chatError", "Invalid conversation ID.");
          return;
        }

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.userId
        });

        if (!conversation) {
          socket.emit(
            "chatError",
            "You are not allowed to join this conversation."
          );
          return;
        }

        const roomName = conversation._id.toString();

        await socket.join(roomName);

        socket.emit("joinedConversation", {
          conversationId: roomName
        });

      } catch (error) {
        console.error("Join Conversation Error:", error.message);
        socket.emit("chatError", "Could not join conversation.");
      }
    });

    // Leave a conversation room
    socket.on("leaveConversation", (conversationId) => {
      if (
        typeof conversationId === "string" &&
        mongoose.Types.ObjectId.isValid(conversationId)
      ) {
        socket.leave(conversationId);
      }
    });

    socket.on("disconnect", () => {
      console.log("Chat user disconnected:", socket.userId);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO
};
