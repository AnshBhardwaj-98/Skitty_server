import jwt from "jsonwebtoken";

export const GenerateToken = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // ⬅️ true, because Render uses HTTPS
    sameSite: "None", // ⬅️ required for cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
