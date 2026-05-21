import type { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";
import { apiT } from "@/utils/i18n";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(error);
  res.status(500).json({ error: apiT(req, "errors.internal") });
}
