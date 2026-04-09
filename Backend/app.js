const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./db/dbconnect");
const authRouter = require("./Route/userauth");
const userRouter = require("./Route/userRoute");
const messageRouter = require("./Route/messageRoute");
const path = require("path");
const express = require("express");
const http = require("http");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chatapp-one-indol.vercel.app"],
    credentials: true,
  },
});

app.use(cors({
  origin: ["http://localhost:5173", "https://chatapp-one-indol.vercel.app"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

// Store active users
const activeUsers = new Map();

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // User joins with their ID
  socket.on("user_join", (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
    io.emit("users_online", Array.from(activeUsers.keys()));
  });

  // Send message event
  socket.on("send_message", (data) => {
    const { receiverId, message, senderId, conversationId } = data;
    const receiverSocketId = activeUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", {
        senderId,
        message,
        conversationId,
        timestamp: new Date(),
      });
    }

    // Also emit to sender for confirmation
    socket.emit("message_sent", {
      senderId,
      message,
      conversationId,
      timestamp: new Date(),
    });
  });

  // User typing event
  socket.on("user_typing", (data) => {
    const { receiverId, senderId } = data;
    const receiverSocketId = activeUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user_typing_notification", { senderId });
    }
  });

  // User disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        io.emit("users_online", Array.from(activeUsers.keys()));
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to database:", error);
    process.exit(1);
  });

