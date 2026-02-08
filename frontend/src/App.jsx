import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./App.css";

const socket = io("http://localhost:3000",{
  
});


function App() {
  const [message, setMessage] = useState("");
  
  return (
    <>
      <h1>Welcome to the Frontend!</h1>
      {message && <p>{message}</p>}
    </>
  );
}

export default App;
