const fail = (res, msg) => res.status(400).json({ message: msg });

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req, res, next) => {
  const { email, password, displayName } = req.body;
  if (!email || !emailRe.test(email))
    return fail(res, "Valid email is required");
  if (!password || password.length < 8)
    return fail(res, "Password must be at least 8 characters");
  if (!displayName || displayName.trim().length < 2)
    return fail(res, "Display name must be at least 2 characters");
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, "Email and password are required");
  next();
};

export const validateMessage = (req, res, next) => {
  const { receiverId, content } = req.body;
  if (!receiverId) return fail(res, "Receiver is required");
  if (!content?.trim()) return fail(res, "Message content is required");
  if (content.length > 2000) return fail(res, "Message too long");
  next();
};
