const EVENTS = require("../constants/events");

function registerRoomHandlers(
  socket,
  io,
  roomUsers,
  roomCode
) {

  socket.on(EVENTS.JOIN_ROOM, ({ roomId, username }) => {

    socket.roomId = roomId;
    socket.username = username;

    socket.join(roomId);

    console.log(
      `${username} (${socket.id}) joined room ${roomId}`
    );

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }

    const existingUser =
      roomUsers[roomId].find(
        (user) => user.socketId === socket.id
      );

    if (!existingUser) {
      roomUsers[roomId].push({
        socketId: socket.id,
        username,
      });
    }

    io.to(roomId).emit(
      EVENTS.ROOM_USERS,
      roomUsers[roomId]
    );

    socket.to(roomId).emit(
      EVENTS.USER_JOINED,
      {
        socketId: socket.id,
        username,
      }
    );

    socket.emit(
      EVENTS.SYNC_CODE,
      roomCode[roomId] || ""
    );
  });

  socket.on(EVENTS.CODE_CHANGE, ({ code }) => {

    const roomId = socket.roomId;

    if (!roomId) return;

    roomCode[roomId] = code;

    socket.to(roomId).emit(
      EVENTS.RECEIVE_CODE,
      code
    );
  });

  socket.on(EVENTS.LEAVE_ROOM, () => {

    const roomId = socket.roomId;

    if (
      roomId &&
      roomUsers[roomId]
    ) {

      roomUsers[roomId] =
        roomUsers[roomId].filter(
          (user) =>
            user.socketId !== socket.id
        );

      io.to(roomId).emit(
        EVENTS.ROOM_USERS,
        roomUsers[roomId]
      );

      if (
        roomUsers[roomId].length === 0
      ) {
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

    if (
      roomId &&
      roomUsers[roomId]
    ) {

      roomUsers[roomId] =
        roomUsers[roomId].filter(
          (user) =>
            user.socketId !== socket.id
        );

      io.to(roomId).emit(
        EVENTS.ROOM_USERS,
        roomUsers[roomId]
      );

      if (
        roomUsers[roomId].length === 0
      ) {
        delete roomUsers[roomId];
      }
    }

    console.log(
      "User Disconnected:",
      socket.id
    );
  });
}

module.exports = registerRoomHandlers;