
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

/*
Create HTTP Server
*/
const server = http.createServer(app);

/*
Room state
*/
const roomCode = {};
const roomUsers = {};

/*
Attach Socket.IO to HTTP Server
*/
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello from CodeSync Backend!");
});

/*
Listen for socket connections
*/
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("JOIN_ROOM", ({ roomId, username }) => {
    socket.roomId = roomId;
    socket.username = username;

    socket.join(roomId);

    console.log(
      `${username} (${socket.id}) joined room ${roomId}`
    );

    // Maintain room users
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }

   const existingUser = roomUsers[roomId].find(
  (user) => user.socketId === socket.id
);

if (!existingUser) {
  roomUsers[roomId].push({
    socketId: socket.id,
    username,
  });
}

    // Send updated user list to everyone
    io.to(roomId).emit(
      "ROOM_USERS",
      roomUsers[roomId]
    );

    // Notify others
    socket.to(roomId).emit("USER_JOINED", {
      socketId: socket.id,
      username,
    });

    // Send latest code to newcomer
    socket.emit(
      "SYNC_CODE",
      roomCode[roomId] || ""
    );
  });

socket.on("CODE_CHANGE", ({ code }) => {
    const roomId = socket.roomId;

    // User is not in a room anymore
    if (!roomId) {
        return;
    }

    roomCode[roomId] = code;

    socket.to(roomId).emit("RECEIVE_CODE", code);
});
  socket.on("LEAVE_ROOM", () => {
  const roomId = socket.roomId;

  if (roomId && roomUsers[roomId]) {
    roomUsers[roomId] = roomUsers[roomId].filter(
      (user) => user.socketId !== socket.id
    );

    io.to(roomId).emit(
      "ROOM_USERS",
      roomUsers[roomId]
    );

    if (roomUsers[roomId].length === 0) {
      delete roomUsers[roomId];
      delete roomCode[roomId];
    }
  }

  socket.leave(roomId);

  socket.roomId = null;
  socket.username = null;

});

  socket.on("disconnect", () => {
    const roomId = socket.roomId;

    if (roomId && roomUsers[roomId]) {
      roomUsers[roomId] =
        roomUsers[roomId].filter(
          (user) =>
            user.socketId !== socket.id
        );

      io.to(roomId).emit(
        "ROOM_USERS",
        roomUsers[roomId]
      );

      if (roomUsers[roomId].length === 0) {
        delete roomUsers[roomId];
      }
    }

    console.log(
      "User Disconnected:",
      socket.id
    );
  });
});

/*
Start the server
*/
server.listen(3000, () => {
  console.log("Server running on port 3000");
});