import { Server } from "socket.io";
import authenticateSocket from "../middlewares/authenticateSocket.js";
import Meeting from "../models/Meeting.js";

export const meetingParticipants = new Map();

let io;

export const initSocketServer = (server) => {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", async (roomId) => {
      if (!roomId) return;

      try {
        const meeting = await Meeting.findOne({ roomId: roomId });
        if (!meeting || !meeting.isActive) {
          socket.emit("meeting-not-active");
          return;
        }
      } catch (err) {
        console.error("Error checking meeting:", err);
        socket.emit("meeting-not-active");
      }

      socket.join(roomId);
      socket.roomId = roomId;

      if (!meetingParticipants.has(roomId)) {
        meetingParticipants.set(roomId, new Set());
      }

      const existingParticipants = Array.from(meetingParticipants.get(roomId));
      socket.emit("existing-participants", existingParticipants);

      meetingParticipants.get(roomId).add(socket.id);

      socket.to(roomId).emit("user-joined", { socketId: socket.id });
    });

    socket.on("offer", ({ offer, to }) => {
      if (!offer || !to) return;
      socket.to(to).emit("offer", { offer: offer, from: socket.id });
    });

    socket.on("answer", ({ answer, to }) => {
      if (!answer || !to) return;
      socket.to(to).emit("answer", { answer: answer, from: socket.id });
    });

    socket.on("ice-candidate", ({ candidate, to }) => {
      if (!candidate || !to) return;
      socket
        .to(to)
        .emit("ice-candidate", { candidate: candidate, from: socket.id });
    });

    socket.on("disconnect", () => {
      const roomId = socket.roomId;
      if (roomId && meetingParticipants.has(roomId)) {
        meetingParticipants.get(roomId).delete(socket.id);

        socket.to(roomId).emit("user-left", { socketId: socket.id });

        if (meetingParticipants.get(roomId).size === 0)
          meetingParticipants.delete(roomId);
      }
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
