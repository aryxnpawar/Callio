import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTg4YjkzMTM4NWEwYzQ4MzM2OWUwZTciLCJpYXQiOjE3NzA1NzA1MjksImV4cCI6MTc3MDU3MTEyOX0.a5OW6LxNRtF2WGK_98Ja1u29LZlYtJV0OQ9tkegL5Ao" },
});

socket.on("connect", () => {
  console.log("Connected to :", socket.id);

  socket.emit("join-meeting", {
    meetingId: "6988c3420519fc3ccb9bb4bb",
  });
});

socket.on("user-joined", (data) => {
  console.log("User joined:", data);
});
