import User from "../models/User.js";

export const searchUsers = async (query, currentUserId) => {
  if (!query || query.trim().length < 1) return [];

  const regex = new RegExp(query.trim(), "i");
  return User.find({
    _id: { $ne: currentUserId },
    $or: [{ displayName: regex }, { email: regex }],
  })
    .select("displayName email avatar isOnline lastSeen")
    .limit(20)
    .lean();
};
