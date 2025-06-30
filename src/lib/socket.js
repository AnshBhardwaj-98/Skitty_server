import { Server } from "socket.io";
import http from "http";
import express from "express";

const allowedOrigins = [
  "http://localhost:5173",
  "https://skitty-frontend.onrender.com",
];

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS (Socket.IO)"));
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

export function getRecieverID(userID) {
  // console.log(userID + "  " + userSocketMap[userID]);

  return userSocketMap[userID];
}

const userSocketMap = {}; //{userID:socketID}

io.on("connection", (socket) => {
  // console.log(`${socket.id} - user connected`);
  const userID = socket.handshake.query.userID;
  if (userID) userSocketMap[userID] = socket.id;

  // console.log(userSocketMap);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log(`${socket.id} - user disconnected`);
    delete userSocketMap[userID];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
