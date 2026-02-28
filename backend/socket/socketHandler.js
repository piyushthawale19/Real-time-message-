import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtConfig } from "../config/jwt.js";

let io;
export const getSocketInstance = () => io;

function parseCookies(header = "") {
  return Object.fromEntries(
    header.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    }),
  );
}

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
    pingTimeout: 30000,
    pingInterval: 10000,
  });

  io.use(async (socket, next) => {
    try {
      const { accessToken } = parseCookies(socket.handshake.headers.cookie);
      if (!accessToken) return next(new Error("Unauthorized"));

      const { id } = jwt.verify(accessToken, jwtConfig.accessSecret);
      const user = await User.findById(id);
      if (!user) return next(new Error("Unauthorized"));

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { userId } = socket;
    socket.join(userId);
    User.findByIdAndUpdate(userId, { isOnline: true }).exec();
    socket.broadcast.emit("user_online", { userId });

    socket.on("typing", ({ toUserId }) =>
      io.to(toUserId).emit("typing", { fromUserId: userId }),
    );

    socket.on("stop_typing", ({ toUserId }) =>
      io.to(toUserId).emit("stop_typing", { fromUserId: userId }),
    );

    socket.on("message_delivered", ({ messageId, toUserId }) =>
      io.to(toUserId).emit("message_delivered", { messageId }),
    );

    socket.on("disconnect", async () => {
      const lastSeen = new Date();
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });
      socket.broadcast.emit("user_offline", { userId, lastSeen });
    });
  });

  return io;
};
