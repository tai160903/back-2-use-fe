// src/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let socket = null;

// Khởi tạo kết nối
export function connectSocket(userId, mode) {

  if (!userId || !mode) {
    console.warn("Thiếu userId hoặc mode khi connect socket");
    return;
  }

  if (socket && socket.connected) {
    // Nếu đã kết nối, chỉ cần đăng ký lại
    socket.emit("register", { userId, mode });
    return;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
   
    socket.emit("register", { userId, mode });
  });

  socket.on("disconnect", () => {
 
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err.message);
  });
}

// Lắng nghe notification
export function onNotification(callback) {
  if (!socket) {

    return;
  }

  // backend có thể emit "notification" hoặc "notification:new"
  socket.on("notification", callback);
  socket.on("notification:new", callback);
}

// Bỏ lắng nghe
export function offNotification(callback) {
  if (!socket) {
    console.warn("[WS] ❗ offNotification gọi nhưng socket chưa được tạo");
    return;
  }

  socket.off("notification", callback);
  socket.off("notification:new", callback);
}

// Gửi sự kiện test lên server
export function emitTest() {
  if (!socket) {
    console.warn("Socket chưa được khởi tạo");
    return;
  }
  socket.emit("test");
}

// Gửi createNotification qua socket (nếu muốn test bằng WS)
export function emitCreateNotification(dto) {
  if (!socket) {
    console.warn("Socket chưa được khởi tạo");
    return;
  }
  socket.emit("createNotification", dto);
}

// Ngắt kết nối (nếu cần)
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}