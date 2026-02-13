import { useParams } from "react-router-dom";

function Meeting() {
  const { roomId } = useParams();
  return (
    <>
      <h3>Meeting Room</h3>
      <p>Welcome to Meeting Room : {roomId}</p>
    </>
  );
}

export default Meeting;
