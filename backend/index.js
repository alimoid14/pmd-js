import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./db/connectDB.js";
import { socketHandler } from "./sockets/socket.js";



// Create HTTP server
const server = http.createServer(app);

// Socket.io server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Attach socket logic
socketHandler(io);

server.listen(5000, () => {
  // Connect DB
  connectDB();
  console.log("Server running on port 5000");
});
