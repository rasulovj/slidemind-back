import type { Response } from "express";

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ data });
}

export function err(
  res: Response,
  message: string,
  status = 400,
  details?: Record<string, string[]>
) {
  return res.status(status).json({ error: message, ...(details && { details }) });
}
