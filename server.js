const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined in .env");
  process.exit(1);
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Export io if needed elsewhere
module.exports = { server, io };

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("privateMessage", ({ to, message }) => {
    io.to(to).emit("privateMessage", { from: socket.id, message });
  });

  socket.on("joinGroup", (groupName) => {
    socket.join(groupName);
    socket.to(groupName).emit("groupMessage", `${socket.id} joined ${groupName}`);
  });

  socket.on("leaveGroup", (groupName) => {
    socket.leave(groupName);
    socket.to(groupName).emit("groupMessage", `${socket.id} left ${groupName}`);
  });

  socket.on("groupMessage", ({ groupName, message }) => {
    socket.to(groupName).emit("groupMessage", { from: socket.id, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
