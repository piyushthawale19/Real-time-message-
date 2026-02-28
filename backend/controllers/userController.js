import { searchUsers } from "../services/userService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const search = asyncHandler(async (req, res) => {
  const users = await searchUsers(req.query.q, req.user._id);
  res.json({ users });
});
