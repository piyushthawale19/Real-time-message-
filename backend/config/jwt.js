export const jwtConfig = {
  get accessSecret() {
    return process.env.JWT_ACCESS_SECRET;
  },
  get refreshSecret() {
    return process.env.JWT_REFRESH_SECRET;
  },
  accessExpiry: "15m",
  refreshExpiry: "7d",
};
