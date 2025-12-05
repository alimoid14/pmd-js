import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set, get) => ({
  socket: null,

  connectSocket: (userId) => {
    const socket = io("http://localhost:5000", {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null });
  },
}));
