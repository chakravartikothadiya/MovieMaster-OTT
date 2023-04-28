const express = require("express");
const app = express();
const configRoutes = require("./routes");
const cors = require("cors");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");

// app.use(cors());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("session created");
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("socketio", io);

app.use("/LoginForm", (req, res, next) => {
  console.log(req.session.id);
  next();
});

app.use("/Logout", (req, res, next) => {
  console.log(req.session);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

configRoutes(app);

//
io.on("connection", (socket) => {
  console.log("new client connected", socket.id);

  socket.on("join_room", (name) => {
    // socket.leave(name);
    const rooms = socket.rooms;
    // const rooms = Object.keys(socket.rooms);
    console.log(rooms.values());
    rooms.forEach((room) => {
      socket.leave(room);
    });
    console.log("A user joined, ChatRoom name is " + name);
    socket.join(name);
  });

  // socket.on("leave_room", (name) => {
  //   socket.leave(name);
  // });

  socket.on("message", (data) => {
    console.log(data);
    // socket.to(data.room).emit("recieve_message", data);
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect Fired");
  });
});
//
// io.origins("*:*");

server.listen(8080, () => {
  console.log("We've now got a NODE server!");
  console.log("Your routes will be running on http://localhost:8080");
  console.log(`Socket.io is listening on *:${8080}`);
});

// app.listen(8080, () => {
//   console.log("We've now got a NODE server!");
//   console.log("Your routes will be running on http://localhost:8080");
// });
