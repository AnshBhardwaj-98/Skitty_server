import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import { DBconnect } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// PORT and path resolution
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // during dev; Vite client
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

// Simple health route
app.get("/", (req, res) => {
  res.send("skitty");
});

// ✅ Serve frontend in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   // Handle React Router paths
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  DBconnect();
});
