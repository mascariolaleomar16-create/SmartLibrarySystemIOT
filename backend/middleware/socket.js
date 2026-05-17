import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected");

    socket.on("join-user", (userId) => {
      socket.join(userId);
      console.log("User joined room:", userId);
    });

    socket.on("identify", ({ userId, role }) => {
      socket.data.userId = userId;
      socket.data.role = role;
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};