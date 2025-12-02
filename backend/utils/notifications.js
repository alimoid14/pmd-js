import { io } from "../index.js";
import { getReceiverSocketId } from "../sockets/socket.js";

export const sendNotification = (userId, payload) => {
  const socketId = getReceiverSocketId(userId);
  if (socketId) {
    io.to(socketId).emit("notification", payload);
  }
};
