import rateLimit from "express-rate-limit";
import { apiT } from "@/utils/i18n";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  handler: (req, res) => {
    res.status(429).json({ error: apiT(req, "errors.tooManyAttempts") });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  handler: (req, res) => {
    res.status(429).json({ error: apiT(req, "errors.tooManyRequests") });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
