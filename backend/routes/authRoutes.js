import express from "express";
import * as authController from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateRegister, validateLogin } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validateRegister,
  authController.register,
);
router.post("/login", authLimiter, validateLogin, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.me);

export default router;
