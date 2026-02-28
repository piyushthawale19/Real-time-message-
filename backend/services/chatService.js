import Message from "../models/Message.js";
import User from "../models/User.js";
import { escapeHtml } from "../utils/sanitize.js";
import { AppError } from "../utils/AppError.js";

export const getConversation = async (
  userId,
  peerId,
  { limit = 30, before } = {},
) => {
  const filter = {
    $or: [
      { sender: userId, receiver: peerId },
      { sender: peerId, receiver: userId },
    ],
  };
  if (before) filter.createdAt = { $lt: new Date(before) };

  const msgs = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return msgs.reverse();
};

export const sendMessage = async (senderId, receiverId, rawContent) => {
  const content = escapeHtml(rawContent.trim());
  if (!content) throw new AppError("Message cannot be empty", 400);

  return Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
    status: "sent",
  });
};

export const markAsRead = (senderId, receiverId) =>
  Message.updateMany(
    { sender: senderId, receiver: receiverId, status: { $ne: "read" } },
    { $set: { status: "read" } },
  );

export const getContacts = async (userId) => {
  const peers = await Message.aggregate([
    { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
    {
      $project: {
        peer: { $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"] },
        createdAt: 1,
        content: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$peer",
        lastMessage: { $first: "$content" },
        lastTime: { $first: "$createdAt" },
      },
    },
  ]);

  if (!peers.length) return [];

  const users = await User.find({
    _id: { $in: peers.map((p) => p._id) },
  }).lean();
  const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

  return peers
    .map((p) => ({
      user: byId[p._id.toString()],
      lastMessage: p.lastMessage,
      lastTime: p.lastTime,
    }))
    .filter((p) => p.user)
    .sort((a, b) => b.lastTime - a.lastTime);
};
