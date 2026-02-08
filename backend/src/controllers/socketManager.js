import { Server } from "socket.io";
import authenticateSocket from "../middlewares/authenticateSocket.js";

export const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);
  
  return io;

};


