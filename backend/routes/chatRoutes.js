import express from "express";
import * as chatController from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { validateMessage } from "../middleware/validate.js";

const router = express.Router();

router.use(protect, apiLimiter);

router.get("/contacts", chatController.getContacts);
router.get("/messages/:peerId", chatController.getMessages);
router.post("/messages", validateMessage, chatController.sendMessage);
router.patch("/messages/read/:senderId", chatController.markRead);

export default router;
