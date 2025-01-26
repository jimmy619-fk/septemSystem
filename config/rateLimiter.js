const rateLimit = require("express-rate-limit");

const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: options.message || "Too many requests",
  });
};

module.exports = {
  authLimiterRegister: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum of 5 requests
    message: "Too many Register attempts",
  }),
  authLimiterLogin: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum of 5 requests
    message: "Too many login attempts",
  }),
  createTaskLimiter: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Maximum of 20 requests
    message: "Too many task creation attempts",
  }),
};
