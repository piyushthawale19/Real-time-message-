import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtConfig } from "../config/jwt.js";
import { AppError } from "../utils/AppError.js";

const sign = (id, secret, expiresIn) => jwt.sign({ id }, secret, { expiresIn });

const issueTokens = (userId) => ({
  accessToken: sign(userId, jwtConfig.accessSecret, jwtConfig.accessExpiry),
  refreshToken: sign(userId, jwtConfig.refreshSecret, jwtConfig.refreshExpiry),
});

export const registerUser = async ({ email, password, displayName }) => {
  const taken = await User.findOne({ email });
  if (taken) throw new AppError("Email already registered", 409);

  const user = await User.create({ email, password, displayName });
  const tokens = issueTokens(user._id);

  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user: user.toPublicJSON(), ...tokens };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  const valid = user && (await user.comparePassword(password));
  if (!valid) throw new AppError("Invalid credentials", 401);

  const tokens = issueTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  user.isOnline = true;
  await user.save({ validateBeforeSave: false });

  return { user: user.toPublicJSON(), ...tokens };
};

export const refreshAccessToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, jwtConfig.refreshSecret);
  } catch {
    throw new AppError("Invalid refresh token", 403);
  }

  const user = await User.findById(payload.id).select("+refreshToken");
  if (!user || user.refreshToken !== token)
    throw new AppError("Token reuse detected", 403);

  const tokens = issueTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return tokens;
};

export const logoutUser = (userId) =>
  User.findByIdAndUpdate(userId, {
    refreshToken: null,
    isOnline: false,
    lastSeen: new Date(),
  });
