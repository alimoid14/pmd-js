let userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (userId) => userSocketMap[userId];

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    console.log("User connected:", userId);

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      console.log("User disconnected:", userId);
    });
  });
};
