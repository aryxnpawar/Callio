import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";

function Dashboard() {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState("");
  async function handleLogOut() {
    await logout();
    navigate("/login");
  }

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post(
        "/meeting/create",
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      navigate(`/meeting/${response.data.roomId}`,{ state: { isHost: true } });
    } catch (err) {
      console.log(err);
      alert("something went wrong while creating new meeting");
    }
  };

  const handleJoinRoom = async () => {
    const roomId = joinRoomId.trim();
    if (roomId === "") {
      alert("Please enter a room id");
      return;
    }

    try {
      const response = await axios.get(`/meeting/${roomId}/check`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      navigate(`/meeting/${roomId}`,{ state: { isHost: false } });
    } catch (err) {
      const message = err.response?.data?.message || "Unable to join meeting";
      alert(message);
    }
   
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome to your dashboard! Here you can manage your meetings and
        settings.
      </p>
      <button onClick={handleLogOut}>Logout</button>

      <button onClick={handleCreateRoom}>Create a Meeting</button>

      <h4>Join a Meeting</h4>
      <input
        type="text"
        placeholder="enter room id"
        value={joinRoomId}
        onChange={(e) => setJoinRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join</button>
    </div>
  );
}

export default Dashboard;
