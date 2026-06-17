import { Code2 } from "lucide-react";
import CodeEditor from "../components/editor/CodeEditor";
import RoomControls from "../components/editor/RoomControls";
import Participants from "../components/editor/Participants";
import { useLocation, useParams } from "react-router-dom";
import {
  useEffect,
  useState,
  useRef,
} from "react";
import { Menu, X } from "lucide-react";

import socket from "../services/socket";

import { useNavigate } from "react-router-dom";

export default function Editor() {
  const location = useLocation();
  const { roomId } = useParams();

  const username =
    location.state?.username || "Guest";

  const [code, setCode] = useState(
    "// Start coding..."
  );
const [sidebarOpen, setSidebarOpen] =
  useState(false);
  const [users, setUsers] = useState([]);

  const isRemoteUpdate = useRef(false);

  /*
  Join room
  */
 const hasJoined = useRef(false);
 useEffect(() => {
  if (!roomId || hasJoined.current) {
    return;
  }

  hasJoined.current = true;

  socket.emit("JOIN_ROOM", {
    roomId,
    username,
  });
}, [roomId, username]);

  /*
  Receive code updates
  */
  useEffect(() => {
    const handleReceiveCode = (
      newCode
    ) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    };

    socket.on(
      "RECEIVE_CODE",
      handleReceiveCode
    );

    return () => {
      socket.off(
        "RECEIVE_CODE",
        handleReceiveCode
      );
    };
  }, []);

  /*
  Sync latest code for newcomers
  */
  useEffect(() => {
    const handleSyncCode = (
      latestCode
    ) => {
      setCode(latestCode);
    };

    socket.on(
      "SYNC_CODE",
      handleSyncCode
    );

    return () => {
      socket.off(
        "SYNC_CODE",
        handleSyncCode
      );
    };
  }, []);

  /*
  User joined logs
  */
  useEffect(() => {
    const handleUserJoined = ({
      username,
    }) => {
      console.log(
        `${username} joined the room`
      );
    };

    socket.on(
      "USER_JOINED",
      handleUserJoined
    );

    return () => {
      socket.off(
        "USER_JOINED",
        handleUserJoined
      );
    };
  }, []);

  /*
  Participants list
  */
  useEffect(() => {
    const handleRoomUsers = (
      users
    ) => {
      setUsers(users);
    };

    socket.on(
      "ROOM_USERS",
      handleRoomUsers
    );

    return () => {
      socket.off(
        "ROOM_USERS",
        handleRoomUsers
      );
    };
  }, []);
  const copyRoomId = async () => {
  try {
    await navigator.clipboard.writeText(roomId);
    alert("Room ID copied!");
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
  const navigate = useNavigate();
const leaveRoom = () => {
  socket.emit("LEAVE_ROOM");

  navigate("/");
};

 return (
  <div className="h-screen bg-slate-900 text-white relative overflow-hidden">

    {/* Mobile Menu Button */}
    <button
      className="md:hidden absolute top-4 left-4 z-50 bg-slate-800 p-2 rounded-lg"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
    </button>

    <div className="flex h-full">

      {/* Sidebar */}
      <div
        className={`
          fixed md:static
          top-0 left-0
          h-screen
          w-72
          bg-slate-800
          p-5
          flex flex-col
          overflow-y-auto
          transition-transform
          duration-300
          z-40
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >
        <div className="flex items-center gap-2 mb-2">
          <Code2 size={32} />
          <h1 className="text-3xl font-bold">
            CodeSync
          </h1>
        </div>

        <div className="bg-slate-700 p-3 rounded-lg mb-6">
          <p className="text-slate-400 text-sm">
            Logged in as
          </p>

          <p className="font-semibold mt-1">
            {username}
          </p>
        </div>

        <div className="bg-slate-700 p-4 rounded-xl mb-6">
          <p className="text-sm text-slate-300">
            Room ID
          </p>

          <p className="break-all text-sm mt-2 font-medium">
            {roomId}
          </p>
        </div>

        <RoomControls
          roomId={roomId}
          copyRoomId={copyRoomId}
          leaveRoom={leaveRoom}
        />

        <hr className="my-6 border-slate-700" />

        <Participants users={users} />

        <div className="mt-auto pt-6 text-center text-xs text-slate-500">
          CodeSync v1.0
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 md:ml-0 overflow-hidden">
        <CodeEditor
          code={code}
          setCode={setCode}
          socket={socket}
          isRemoteUpdate={isRemoteUpdate}
        />
      </div>
    </div>
  </div>
);
}

