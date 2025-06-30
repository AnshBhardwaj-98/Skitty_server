import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateDP,
} from "../controllers/auth.controllers.js";
import { jwtVerifier } from "../middleware/jwtVerifier.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update-dp", jwtVerifier, updateDP);
router.get("/check", jwtVerifier, checkAuth);

export default router;
