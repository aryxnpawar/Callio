import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    const loginAndConnectSocket = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/login",
          { email: "aryan@gmail.com", password: "123456" },
          { withCredentials: true }
        );

        const accessToken = res.data.accessToken;

        socketRef.current = io("http://localhost:3000", {
          auth: {
            token: accessToken,
          },
        });

        socketRef.current.on("welcome", (msg) => {
          setMessage(msg);
        });
      } catch (err) {
        console.log("Error during login or socket connection : ", err);
      }
    };

    loginAndConnectSocket();

    return () => {
      socketRef.current?.disconnect();
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
