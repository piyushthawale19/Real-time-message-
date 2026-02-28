import express from "express";
import { search } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(protect, apiLimiter);
router.get("/search", search);

export default router;
