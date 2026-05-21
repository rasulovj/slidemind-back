import { Router } from "express";
import { authLimiter } from "@/middleware/rateLimiter";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/authenticate";
import {
  RegisterSchema,
  LoginSchema,
  VerifyEmailSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/validations/auth.validation";
import * as ctrl from "@/controllers/auth.controller";

const router = Router();

router.post("/register",        authLimiter, validate(RegisterSchema),       ctrl.register);
router.post("/login",           authLimiter, validate(LoginSchema),           ctrl.login);
router.post("/refresh",                                                        ctrl.refresh);
router.post("/logout",          authenticate,                                  ctrl.logout);
router.post("/verify-email",    authLimiter, validate(VerifyEmailSchema),     ctrl.verifyEmail);
router.post("/forgot-password", authLimiter, validate(ForgotPasswordSchema),  ctrl.forgotPassword);
router.post("/reset-password",  authLimiter, validate(ResetPasswordSchema),   ctrl.resetPassword);
router.get("/google/start",                                                    ctrl.googleStart);
router.get("/google/callback",                                                 ctrl.googleCallback);
router.post("/telegram/login",                                                 ctrl.telegramLogin);

export default router;
