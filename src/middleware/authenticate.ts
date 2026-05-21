import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/lib/jwt";
import { err } from "@/utils/response";
import { apiT } from "@/utils/i18n";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    err(res, apiT(req, "errors.unauthorized"), 401);
    return;
  }

  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    err(res, apiT(req, "errors.invalidOrExpiredToken"), 401);
  }
}
