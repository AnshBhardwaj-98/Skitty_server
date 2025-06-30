import express from "express";
import { jwtVerifier } from "../middleware/jwtVerifier.middleware.js";
import {
  getAllUser,
  getMessages,
  sendMessage,
} from "../controllers/message.controllers.js";

const Mrouter = express.Router();

Mrouter.get("/user", jwtVerifier, getAllUser);
Mrouter.get("/:id", jwtVerifier, getMessages);
Mrouter.post("/send/:id", jwtVerifier, sendMessage);

export default Mrouter;
