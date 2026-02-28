import * as auth from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
  clearCookieOptions,
} from "../utils/cookieOptions.js";

const setCookies = (res, access, refresh) =>
  res
    .cookie("accessToken", access, accessCookieOptions)
    .cookie("refreshToken", refresh, refreshCookieOptions);

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await auth.registerUser(req.body);
  setCookies(res, accessToken, refreshToken).status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await auth.loginUser(req.body);
  setCookies(res, accessToken, refreshToken).json({ user });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  const { accessToken, refreshToken } = await auth.refreshAccessToken(token);
  setCookies(res, accessToken, refreshToken).json({ ok: true });
});

export const logout = asyncHandler(async (req, res) => {
  await auth.logoutUser(req.user._id);
  res
    .cookie("accessToken", "", clearCookieOptions)
    .cookie("refreshToken", "", clearCookieOptions)
    .json({ ok: true });
});

export const me = (req, res) => res.json({ user: req.user.toPublicJSON() });
