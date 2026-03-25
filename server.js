
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let users = {};

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    users[socket.id] = name;
    io.emit("users", users);
  });

  socket.on("message", (msg) => {
    io.emit("message", {
      name: users[socket.id],
      msg
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", users);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Running on " + PORT));
