import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
    });
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const joinUser = (userId) => {
  const socket = getSocket();
  console.log("📤 Joining user:", userId);
  socket.emit("user_join", userId);
};

export const sendMessage = (data) => {
  const socket = getSocket();
  console.log("📤 Sending message:", data);
  socket.emit("send_message", data);
};

export const onReceiveMessage = (callback) => {
  const socket = getSocket();
  socket.on("receive_message", callback);
};

export const onMessageSent = (callback) => {
  const socket = getSocket();
  socket.on("message_sent", callback);
};

export const onUsersOnline = (callback) => {
  const socket = getSocket();
  socket.on("users_online", callback);
};

export const onUserTyping = (callback) => {
  const socket = getSocket();
  socket.on("user_typing_notification", callback);
};

export const emitUserTyping = (data) => {
  const socket = getSocket();
  console.log("📤 User typing:", data);
  socket.emit("user_typing", data);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
