import type { Request, Response } from "express";
import * as SlideService from "@/services/slide.service";
import { ok, err } from "@/utils/response";
import { apiT } from "@/utils/i18n";

export async function listSlides(req: Request, res: Response) {
  try {
    const presentationId = String(req.query.presentationId ?? "");
    if (!presentationId) return err(res, apiT(req, "errors.presentationIdRequired"), 400);
    const slides = await SlideService.list(presentationId, req.user!.userId);
    return ok(res, slides);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    return err(res, apiT(req, "errors.failedFetchSlides"), 500);
  }
}

export async function createSlide(req: Request, res: Response) {
  try {
    const slide = await SlideService.create({ userId: req.user!.userId, ...req.body });
    return ok(res, slide, 201);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    return err(res, apiT(req, "errors.failedCreateSlide"), 500);
  }
}

export async function updateSlide(req: Request, res: Response) {
  try {
    const slide = await SlideService.update(String(req.params.id), req.user!.userId, req.body);
    return ok(res, slide);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.slideNotFound"), 404);
    return err(res, apiT(req, "errors.failedUpdateSlide"), 500);
  }
}

export async function deleteSlide(req: Request, res: Response) {
  try {
    await SlideService.remove(String(req.params.id), req.user!.userId);
    return ok(res, { message: apiT(req, "messages.deleted") });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.slideNotFound"), 404);
    return err(res, apiT(req, "errors.failedDeleteSlide"), 500);
  }
}

export async function duplicateSlide(req: Request, res: Response) {
  try {
    const slide = await SlideService.duplicate(String(req.params.id), req.user!.userId);
    return ok(res, slide, 201);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.slideNotFound"), 404);
    return err(res, apiT(req, "errors.failedDuplicateSlide"), 500);
  }
}

export async function reorderSlides(req: Request, res: Response) {
  try {
    await SlideService.reorder({ userId: req.user!.userId, ...req.body });
    return ok(res, { message: apiT(req, "messages.reordered") });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    return err(res, apiT(req, "errors.failedReorderSlides"), 500);
  }
}
