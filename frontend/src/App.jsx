import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("welcome", (data) => {
      setMessage(data);
    });

    return () => {
      socket.off("welcome", setMessage);
    };
  }, []);

  return (
    <>
      <h1>Welcome to the Frontend!</h1>
      {message && <p>{message}</p>}
    </>
  );
}

export default App;
