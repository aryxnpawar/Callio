import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTg0OTUyMDNlNzllOGNhNDNjYmFiOTUiLCJpYXQiOjE3NzA4OTgxNzgsImV4cCI6MTc3MDg5ODc3OH0.tdHhQyY7MsUsg344cbaw5tx6ABurIZ8cgcDoTZrYcyE",
  },
});

function App() {
  const [roomId, setRoomId] = useState("70583843a7");
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.emit('join-room',(roomId))

    socket.on("meeting-ended",()=>{
      console.log('meeting ended')
    });

    socket.on("meeting-not-active",()=>{
      console.log(" no such meeting or has ended")
    });

    socket.on("offer", ({ offer, roomId }) => {
      console.log("got offer :", offer, ", from room :", roomId);
    });

    socket.on("answer", ({ answer, roomId }) => {
      console.log("got answer :", answer, ", from room :", roomId);
    });

    socket.on("ice-candidate", ({ candidate, roomId }) => {
      console.log("got candidate :", candidate, ", from room :", roomId);
    });

    socket.on("disconnect", () => {
      console.log(socket.id);
    });
    socket.on("connect_error", (error) => {
      console.log(error.message);
    });

    // return ()=>{
    //   socket.disconnect();
    // }
  }, []);

  const sendOffer = () => {
    socket.emit("offer", { offer: { offer: "fake offer" }, roomId: roomId });
  };
  const sendAnswer = () => {
    socket.emit("answer", {
      answer: { fake: "answer" },
      roomId,
    });
  };
  const sendIceCandidate = () => {
    socket.emit("ice-candidate", {
      candidate: { fake: ['12','23'] },
      roomId,
    });
  };

  return (
    <>
      <button onClick={sendOffer}>Offer</button>
      <button onClick={sendAnswer}>Answer</button>
      <button onClick={sendIceCandidate}>Ice Candidate</button>
    </>
  );
}

export default App;
