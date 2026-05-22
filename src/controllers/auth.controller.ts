import type { Request, Response } from "express";
import * as AuthService from "@/services/auth.service";
import { ok, err } from "@/utils/response";
import { apiT } from "@/utils/i18n";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax") as "strict" | "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function frontendCallbackBase() {
  return process.env.FRONTEND_URL || "http://localhost:3000";
}

export async function register(req: Request, res: Response) {
  try {
    const user = await AuthService.register(req.body);
    return ok(res, { user, message: apiT(req, "auth.checkEmail") }, 201);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "EMAIL_TAKEN") {
      return err(res, apiT(req, "auth.emailTaken"), 409);
    }
    return err(res, apiT(req, "errors.registrationFailed"), 500);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken, user } = await AuthService.login(req.body);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
    return ok(res, { accessToken, user });
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message === "INVALID_CREDENTIALS") return err(res, apiT(req, "auth.invalidCredentials"), 401);
    }
    return err(res, apiT(req, "errors.loginFailed"), 500);
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return err(res, apiT(req, "auth.noRefreshToken"), 401);
    const { accessToken, refreshToken, user } = await AuthService.refresh(token);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
    return ok(res, { accessToken, user });
  } catch {
    return err(res, apiT(req, "auth.invalidRefreshToken"), 401);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    if (req.user) await AuthService.logout(req.user.userId);
    res.clearCookie("refreshToken");
    return ok(res, { message: apiT(req, "auth.loggedOut") });
  } catch {
    return err(res, apiT(req, "auth.logoutFailed"), 500);
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken, user } = await AuthService.verifyEmail(req.body.token);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
    return ok(res, { accessToken, user });
  } catch {
    return err(res, apiT(req, "auth.invalidVerificationLink"), 400);
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    await AuthService.forgotPassword(req.body.email);
    return ok(res, { message: apiT(req, "auth.resetSent") });
  } catch {
    return err(res, apiT(req, "auth.resetEmailFailed"), 500);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    await AuthService.resetPassword(req.body.token, req.body.password);
    return ok(res, { message: apiT(req, "auth.passwordUpdated") });
  } catch {
    return err(res, apiT(req, "auth.invalidResetLink"), 400);
  }
}

export async function googleStart(_req: Request, res: Response) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) return err(res, apiT(_req, "auth.googleUnavailable"), 500);

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("prompt", "select_account");
  return res.redirect(url.toString());
}

export async function googleCallback(req: Request, res: Response) {
  const code = String(req.query.code ?? "");
  const error = String(req.query.error ?? "");
  const redirectBase = frontendCallbackBase();

  if (error) return res.redirect(`${redirectBase}/callback?error=google_cancelled`);
  if (!code) return res.redirect(`${redirectBase}/callback?error=google_code_missing`);

  try {
    const { refreshToken, accessToken } = await AuthService.loginWithGoogle(code);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
    return res.redirect(`${redirectBase}/callback?provider=google&token=${encodeURIComponent(accessToken)}`);
  } catch {
    return res.redirect(`${redirectBase}/callback?error=google_failed`);
  }
}

export async function telegramLogin(req: Request, res: Response) {
  try {
    const { refreshToken, accessToken, user } = await AuthService.loginWithTelegram(req.body);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
    return ok(res, { accessToken, user });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "TELEGRAM_NOT_CONFIGURED") return err(res, apiT(req, "auth.telegramUnavailable"), 500);
    if (e instanceof Error && e.message === "TELEGRAM_EXPIRED") return err(res, apiT(req, "auth.telegramExpired"), 401);
    return err(res, apiT(req, "auth.telegramFailed"), 401);
  }
}
