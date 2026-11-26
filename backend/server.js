
const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const purchaseRequestRoutes = require("./routes/purchaseRequestRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const swapRoutes = require("./routes/swapRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Initialize Express
const app = express();

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campus-loop-three.vercel.app"
  ]
}));

// Temporary request logger
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// Parse JSON
app.use(express.json());

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/purchase-requests", purchaseRequestRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/chat", chatRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampusLoop Backend is running!"
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make Socket.IO available inside Express controllers
app.set("io", io);

// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`CampusLoop server running on port ${PORT}`);
      console.log("Socket.IO is ready for real-time chat.");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
