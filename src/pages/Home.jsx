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
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
   <div className="w-full max-w-md bg-slate-800/90 backdrop-blur rounded-2xl p-8 shadow-2xl border border-slate-700">

   <h1 className="text-5xl font-extrabold text-center mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
  CodeSync
</h1>

     <p className="text-slate-400 text-center mb-8">
  Code together. Collaborate instantly.
</p>

      <div className="mb-4">
        <label className="block text-slate-300 mb-2">
          Your Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-slate-300 mb-2">
          Room ID
        </label>

        <input
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
        />
      </div>

      <button
        onClick={generateRoomId}
        className="w-full bg-slate-700 text-white py-3 rounded-lg mb-3 hover:bg-slate-600 transition"
      >
        Generate Room ID
      </button>

      <button
        onClick={joinRoom}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition"
      >
        Join Room
      </button>

        <p className="text-center text-slate-500 text-sm mt-6">
  Built with React, Socket.IO 
</p>

    </div>
  
  </div>
);
}