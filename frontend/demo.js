import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OThjOGRlY2ZjMmUwZTY1MTViZGMwMDUiLCJpYXQiOjE3NzA4NjQ3MDEsImV4cCI6MTc3MDg2NTMwMX0.AJJiI7fd7IEijY-1pad7l2zpjUOsb9Z-9jJ9b61pXQA",
  },
});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Connection failed:", err.message);
});

socket.emit("join-room", { roomId: "7231a6d890" });
socket.on("user-joined", ({socketId}) => {
  console.log("Another user joined:", socketId);
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server:");
});
