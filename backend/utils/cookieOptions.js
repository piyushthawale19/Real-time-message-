const isProd = process.env.NODE_ENV === "production";

const base = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  path: "/",
};

export const accessCookieOptions = {
  ...base,
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
  ...base,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearCookieOptions = {
  ...base,
  maxAge: 0,
};
