
import { useLocation, useParams } from "react-router-dom";
import {
  useEffect,
  useState,
  useRef,
} from "react";

import socket from "../services/socket";
import MonacoEditor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";

export default function Editor() {
  const location = useLocation();
  const { roomId } = useParams();

  const username =
    location.state?.username || "Guest";

  const [code, setCode] = useState(
    "// Start coding..."
  );

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
    <div>
    
      
      <h2>Editor Page</h2>

      <p>
        Welcome, {username}
      </p>

      <p>
        Room ID: {roomId}
      </p>
      <button onClick={copyRoomId}>
  📋 Copy Room ID
</button>


      <h3>Participants</h3>

      <ul>
        {users.map((user) => (
          <li key={user.socketId}>
            🟢 {user.username}
          </li>
        ))}
      </ul>

      <MonacoEditor
        height="80vh"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => {
          const newCode =
            value || "";

          setCode(newCode);

          if (
            isRemoteUpdate.current
          ) {
            isRemoteUpdate.current = false;
            return;
          }

          socket.emit(
            "CODE_CHANGE",
            {
            
              code: newCode,
            }
          );
        }}
      />
      <button onClick={leaveRoom}>
  🚪 Leave Room
</button>
    </div>
  );
}

