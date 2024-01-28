const express = require("express");
var cors = require("cors");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { createMessage } = require("./utils/createMessgae");
const { getUser, addUser, removeUser } = require("./utils/user");
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
const filter = new Filter({ list: ["yourmother", "ngu", "khung", "now"] });
io.on("connection", (socket) => {
  //connect room

  //join room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    // say hi user client
    socket.broadcast
      .to(roomId)
      .emit(
        "send-welcome-message-to-client",
        createMessage(
          `Người dùng ${username} vừa vào phòng chat: ` + " " + roomId,
          username
        )
      );
    socket.emit("send-welcome-message-to-client", {
      message: "Chào mừng đên với phòng chat: " + roomId,
      username,
      roomId,
    });

    //send messgae
    socket.on("send-massage-to-server", (data, cb) => {
      io.to(roomId).emit(
        "send-message-to-client",
        createMessage(filter.clean(data.message), username)
      );
      cb();
    });

    //send location
    socket.on("send-location-to-server", ({ latitude, longitude }) => {
      const linkLocation = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      io.to(roomId).emit(
        "send-location-to-client",
        createMessage(linkLocation, username)
      );
    });

    //add user to list user
    const newUser = {
      id: socket.id,
      username,
      room: roomId,
    };
    addUser(newUser);

    //send listUser
    io.to(roomId).emit("send-list-user", { listUser: getUser(roomId) });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(roomId).emit("user-disconnect", username);
      io.to(roomId).emit("send-list-user", {
        listUser: getUser(roomId),
        username,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("askdahsgd 123");
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("app run on http://localhost:3000");
});
