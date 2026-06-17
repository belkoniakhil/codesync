const EVENTS = require("../constants/events");

function registerChatHandlers(socket, io) {

  socket.on(
    EVENTS.SEND_MESSAGE,
    ({ roomId, message }) => {
              console.log(message);

      io.to(roomId).emit(
        EVENTS.RECEIVE_MESSAGE,
        message
      );

    }
  );
}

module.exports = registerChatHandlers;