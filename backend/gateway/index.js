const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/", (req, res) => res.send("OK"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  path: "/socket.io",
});

// ------------------------------
// Redis Subscriber
// ------------------------------
const sub = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
});

sub.on("connect", () => console.log("Redis connected (ioredis)"));
sub.on("error", (err) => console.error("Redis error:", err));

// Async init for Redis
async function initRedis() {
  await sub.psubscribe("auction_channel:*");
  console.log("Subscribed to auction_channel:*");

  sub.on("pmessage", (pattern, channel, message) => {
    try {
      const data = JSON.parse(message);

      // Extract auctionId from channel name: auction_channel:123
      const auctionId = channel.split(":")[1];

      console.log("Redis Message:", data, " Auction:", auctionId);

      // Emit message to specific auction room
      io.to("auction:" + auctionId).emit("new-bid", data);

    } catch (err) {
      console.error("Error parsing Redis message:", err);
    }
  });
}

// Start Redis listener
initRedis();

// ------------------------------
// Socket.io Connection
// ------------------------------
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // User joins auction room
  socket.on("join-auction", ({ auctionId }) => {
    console.log(`Socket ${socket.id} joining auction room:`, auctionId);
    socket.join("auction:" + auctionId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ------------------------------
// Start HTTP Server
// ------------------------------
const PORT = process.env.API_GATEWAY_PORT || 4000;

server.listen(PORT, () => {
  console.log("Gateway running on port", PORT);
});