const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const handleSocketConnection =
  require("./socket/socketHandler");

const app = express();

app.use(cors());

const server =
  http.createServer(app);

const roomCode = {};
const roomUsers = {};

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://codesync-wine.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send(
    "Hello from CodeSync Backend!"
  );
});

io.on("connection", (socket) => {

  console.log(
    "User Connected:",
    socket.id
  );

  handleSocketConnection(
    io,
    socket,
    roomUsers,
    roomCode
  );
});

const PORT =
  process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});