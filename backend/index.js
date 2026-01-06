import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./db/connectDB.js";
import { socketHandler } from "./sockets/socket.js";
// Create HTTP server
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Socket.io server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Attach socket logic
socketHandler(io);

server.listen(PORT, () => {
  // Connect DB
  connectDB();
  console.log("Server running on port 5000");
});
