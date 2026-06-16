import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
      const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const generateRoomId = () => {
  const id = crypto.randomUUID();
  setRoomId(id);
};

  const joinRoom = () => {
  if (!name || !roomId) {
    alert("Please enter your name and room ID");
    return;
  }

  navigate(`/editor/${roomId}`, {
  state: { username:name },
});};

  return (
    <div>
      <h1>CodeSync</h1>

      <div>
        <label>Your Name</label>
        <br />
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <br />
      <div>  
        <label>Room ID</label>
        <br />
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>

      <br />

      <button onClick={generateRoomId}>
  Generate Room ID
</button>

      <br />
      <br />
    <button onClick={joinRoom}>
  Join Room
</button>
      <p>Name: {name}</p>
<p>Room ID: {roomId}</p>
    </div>
  );
}