import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtConfig } from "../config/jwt.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const { id } = jwt.verify(token, jwtConfig.accessSecret);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    res
      .status(401)
      .json({
        message: expired ? "Token expired" : "Invalid token",
        ...(expired && { code: "TOKEN_EXPIRED" }),
      });
  }
};
