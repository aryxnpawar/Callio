import { io } from "socket.io-client";
const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OThjOGRlY2ZjMmUwZTY1MTViZGMwMDUiLCJpYXQiOjE3NzA5MDM1MzIsImV4cCI6MTc3MDkwNDEzMn0.PG4cZGrjUr1l3o6SbbFYtL9Ydr6VGHKxkoRAB0tom8A", //
  },
});

socket.on("connect", () => {
  socket.emit("join-room", "e629792c15"); //
  console.log(socket.id);
});

socket.on("meeting-ended", () => {
  console.log("meeting ended");
});

socket.on("meeting-not-active", () => {
  console.log(" no such meeting or has ended");
});

socket.on("disconnect", () => {
  console.log(socket.id);
});
socket.on("connect_error", (error) => {
  console.log(error.message);
});
