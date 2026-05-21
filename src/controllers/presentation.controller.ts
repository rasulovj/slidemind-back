import type { Request, Response } from "express";
import * as PresentationService from "@/services/presentation.service";
import * as ExportService from "@/services/export.service";
import { ok, err } from "@/utils/response";
import { apiT } from "@/utils/i18n";
import { logger } from "@/utils/logger";

export async function listPresentations(req: Request, res: Response) {
  try {
    const { page = "1", limit = "20", search = "" } = req.query;
    const result = await PresentationService.list({
      userId: req.user!.userId,
      page: Number(page),
      limit: Math.min(Number(limit), 50),
      search: String(search),
    });
    return ok(res, result);
  } catch {
    return err(res, apiT(req, "errors.failedFetchPresentations"), 500);
  }
}

export async function createPresentation(req: Request, res: Response) {
  try {
    const presentation = await PresentationService.create({
      userId: req.user!.userId,
      ...req.body,
    });
    return ok(res, presentation, 201);
  } catch {
    return err(res, apiT(req, "errors.failedCreatePresentation"), 500);
  }
}

export async function getPresentation(req: Request, res: Response) {
  try {
    const presentation = await PresentationService.getById(String(req.params.id), req.user!.userId);
    return ok(res, presentation);
  } catch {
    return err(res, apiT(req, "errors.presentationNotFound"), 404);
  }
}

export async function exportPresentation(req: Request, res: Response) {
  try {
    const format = String(req.params.format);
    if (format !== "pptx" && format !== "pdf") return err(res, apiT(req, "errors.unsupportedExportFormat"), 400);

    const file = await ExportService.exportPresentation(String(req.params.id), req.user!.userId, format);
    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.setHeader("Content-Length", String(file.buffer.length));
    return res.send(file.buffer);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    logger.error({ err: e, presentationId: req.params.id, format: req.params.format }, "Presentation export failed");
    return err(res, apiT(req, "errors.failedExportPresentation"), 500);
  }
}

export async function updatePresentation(req: Request, res: Response) {
  try {
    const presentation = await PresentationService.update(String(req.params.id), req.user!.userId, req.body);
    return ok(res, presentation);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    return err(res, apiT(req, "errors.failedUpdatePresentation"), 500);
  }
}

export async function deletePresentation(req: Request, res: Response) {
  try {
    await PresentationService.remove(String(req.params.id), req.user!.userId);
    return ok(res, { message: apiT(req, "messages.deleted") });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    return err(res, apiT(req, "errors.failedDeletePresentation"), 500);
  }
}

export async function duplicatePresentation(req: Request, res: Response) {
  try {
    const copy = await PresentationService.duplicate(String(req.params.id), req.user!.userId);
    return ok(res, copy, 201);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    return err(res, apiT(req, "errors.failedDuplicatePresentation"), 500);
  }
}

export async function toggleShare(req: Request, res: Response) {
  try {
    const presentation = await PresentationService.toggleShare(String(req.params.id), req.user!.userId);
    return ok(res, presentation);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    return err(res, apiT(req, "errors.failedToggleSharing"), 500);
  }
}

export async function getSharedPresentation(req: Request, res: Response) {
  try {
    const presentation = await PresentationService.getByShareToken(String(req.params.token));
    return ok(res, presentation);
  } catch {
    return err(res, apiT(req, "errors.presentationNotFound"), 404);
  }
}
