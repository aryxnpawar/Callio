import { Server } from "socket.io";
import authenticateSocket from "../middlewares/authenticateSocket.js";

export const meetingParticipants = new Map();

let io;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", ( roomId ) => {
      if (!roomId) return;

      socket.join(roomId);

      if (!meetingParticipants.has(roomId)) {
        meetingParticipants.set(roomId, new Set());
      }

      meetingParticipants.get(roomId).add(socket.id);

      socket.to(roomId).emit("user-joined", { socketId: socket.id });
    });

    socket.on("offer", ({ offer, roomId }) => {
      if (!offer || !roomId) return;

      socket.to(roomId).emit("offer", { offer, roomId });
    });

    socket.on("answer", ({ answer, roomId }) => {
      if (!answer || !roomId) return;
      socket.to(roomId).emit("answer", { answer, roomId });
    });

    socket.on("ice-candidate", ({ candidate, roomId }) => {
      if (!candidate || !roomId) return;
      socket.to(roomId).emit("ice-candidate", { candidate, roomId });
    });

    socket.on("disconnect", () => {
      for (const [roomId, participants] of meetingParticipants.entries()) {
        if (participants.has(socket.id)) {
          participants.delete(socket.id);

          socket.to(roomId).emit("user-left", { socketId: socket.id });
        }
        if (participants.size === 0) {
          meetingParticipants.delete(roomId);
        }
      }

      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => io;
