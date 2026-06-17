const registerRoomHandlers =
 require("./roomHandlers");
const registerChatHandlers =
  require("./chatHandlers");
function handleSocketConnection(
  io,
  socket,
  roomUsers,
  roomCode
) {
  console.log("User Connected:", socket.id);

  registerRoomHandlers(
    socket,
    io,
    roomUsers,
    roomCode
  );
   registerChatHandlers(
    socket,
    io
  );
}

module.exports = handleSocketConnection;