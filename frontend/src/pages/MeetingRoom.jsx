import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "../api/axios";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

function MeetingRoom() {
  const { accessToken } = useAuth();
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
  const isHost = location.state?.isHost || false;

  const [localConnected, setLocalConnected] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const createPeerConnection = (socket, remoteSocketId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: remoteSocketId,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setRemoteConnected(true);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE state:", pc.iceConnectionState);
      if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed"
      ) {
        setRemoteConnected(false);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  useEffect(() => {
    let socket;
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to get media:", err);
        alert("Could not access camera/microphone");
        navigate("/dashboard");
        return;
      }

      socket = io("http://localhost:3000", {
        auth: { token: accessToken },
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        setLocalConnected(true);
        socket.emit("join-room", roomId);
      });

      socket.on("existing-participants", async (participants) => {
        if (participants.length === 0) {
          console.log("No one else here, Waiting...");
          return;
        }
        const remoteSocketId = participants[0];
        const pc = createPeerConnection(socket, remoteSocketId);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { offer, to: remoteSocketId });
      });

      socket.on("offer", async ({ offer, from }) => {
        const pc = createPeerConnection(socket, from);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", { answer, to: from });
      });

      socket.on("answer", async ({ answer, from }) => {
        const pc = peerConnectionRef.current;
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("ice-candidate", async ({ candidate, from }) => {
        const pc = peerConnectionRef.current;
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        }
      });

      socket.on("user-left", ({ socketId }) => {
        console.log("User left:", socketId);
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        setRemoteConnected(false);
      });

      socket.on("meeting-ended", () => {
        alert("Meeting has been ended by the host");
        navigate("/dashboard");
      });

      socket.on("meeting-not-active", () => {
        alert("This meeting is no longer active");
        navigate("/dashboard");
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    };

    init();

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      // Stop camera/mic
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      // Disconnect socket
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId, accessToken, navigate]);

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const endMeeting = async () => {
    try {
      await axios.post(
        `/meeting/${roomId}/end`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Error ending meeting:", err);
      alert("Failed to end meeting");
    }
  };

  const leaveMeeting = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Meeting Room</h1>
      <p>
        Room ID: <strong>{roomId}</strong>
      </p>
      <p>Status: {localConnected ? "Connected" : "Connecting..."}</p>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div>
          <h3>You</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "400px",
              background: "#000",
              borderRadius: "8px",
            }}
          />
        </div>
        <div>
          <h3>{remoteConnected ? "Remote Peer" : "Waiting for peer..."}</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: "400px",
              background: "#000",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={toggleMic}>
          {isMicOn ? "Mute Mic" : "Unmute Mic"}
        </button>
        <button onClick={toggleCamera}>
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button onClick={leaveMeeting}>Leave Meeting</button>
        {isHost && (
          <button onClick={endMeeting} style={{ background: "red", color: "white" }}>
            End Meeting
          </button>
        )}
      </div>
    </div>
  );
}

export default MeetingRoom;
