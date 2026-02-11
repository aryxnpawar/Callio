import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
   auth: {
     token: "eyJhbGciOiJIUzI1NiIsInR5cCpXVCJ9.eyJ1c2VySWQiOiI2OTg0OTUyMDNlNzllOGNhNDNjYmFiOTUiLCJpYXQiOjE3NzA4Mjc3MTksImV4cCI6MTc3MDgyODMxOX0.qtJeOxu4PhsufHHgzkZKPGrQLjIeUbvTjCn5lq8RpSk"
}});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("Connection failed:", err.message);
  });

socket.emit("join-room", { roomId: "9cd2ac89bf" });
socket.on("user-joined", (data) => {
    console.log("Another user joined:", data);
  });

socket.on("disconnect", () => {
    console.log("Disconnected from the server:");
  });