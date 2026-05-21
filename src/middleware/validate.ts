import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { err } from "@/utils/response";
import { apiT } from "@/utils/i18n";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      err(res, apiT(req, "errors.validationFailed"), 400, result.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }
    req.body = result.data;
    next();
  };
}
