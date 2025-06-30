import jwt from "jsonwebtoken";

export const GenerateToken = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // JS can't access the cookie
    secure: false, // send over HTTPS only (set false in dev)
    sameSite: "None", // prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
