import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const jwtVerifier = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "cannot get token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return res.status(401).json({ message: "invalid token" });

    const user = await User.findById(decoded.userID).select("-password");
    if (!user) return res.status(401).json({ message: "no user found" });

    req.user = user;

    next();
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error });
  }
};
