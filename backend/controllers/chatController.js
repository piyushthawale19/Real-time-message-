import * as chat from "../services/chatService.js";
import { getSocketInstance } from "../socket/socketHandler.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await chat.getContacts(req.user._id);
  res.json({ contacts });
});

export const getMessages = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 30, 50);
  const messages = await chat.getConversation(req.user._id, req.params.peerId, {
    limit,
    before: req.query.before,
  });
  res.json({ messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  const message = await chat.sendMessage(req.user._id, receiverId, content);

  getSocketInstance()
    .to(receiverId.toString())
    .emit("new_message", {
      ...message.toObject(),
      senderData: req.user.toPublicJSON(),
    });

  res.status(201).json({ message });
});

export const markRead = asyncHandler(async (req, res) => {
  await chat.markAsRead(req.params.senderId, req.user._id);
  getSocketInstance()
    .to(req.params.senderId.toString())
    .emit("message_read", { readBy: req.user._id });
  res.json({ ok: true });
});
