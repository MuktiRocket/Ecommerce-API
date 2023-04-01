const dotenv = require("dotenv").config();
const http = require("http");
const cors = require("cors");
const express = require("express");
const { isAuth } = require("./middleware/authMiddleware");
const usersRouter = require("./routers/usersRouter");
const app = express();
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);
server.listen(process.env.APP_PORT, () => {
  console.log("server is running on: ", process.env.APP_PORT);
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //   console.log(socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    // console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use("/api/user", usersRouter);
