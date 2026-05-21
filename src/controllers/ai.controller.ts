import type { Request, Response } from "express";
import * as AiService from "@/services/ai.service";
import * as BillingService from "@/services/billing.service";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/utils/response";
import { apiT } from "@/utils/i18n";
import { getPreset } from "@/lib/templates/presets";

export async function generatePresentation(req: Request, res: Response) {
  try {
    const { presentationId, topic, slideCount, language, presetId } = req.body;
    const userId = req.user!.userId;

    const effectiveSlideCount = resolveSlideCount(slideCount, presetId);

    // Check credits before starting generation
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
    if (!user) return err(res, apiT(req, "errors.userNotFound"), 404);
    if (user.credits < effectiveSlideCount) {
      return err(res, apiT(req, "errors.notEnoughCreditsDetailed", {
        required: effectiveSlideCount,
        available: user.credits,
      }), 402);
    }

    const result = await AiService.generatePresentation({
      presentationId,
      userId,
      topic,
      slideCount: slideCount ?? 8,
      language: language ?? "en",
      presetId,
    });

    // Deduct 1 credit per slide actually generated
    if (result.generated) {
      const actualSlideCount = result.slides.length;
      await BillingService.deductCredit(
        userId,
        actualSlideCount,
        `AI presentation "${result.title}" — ${actualSlideCount} slides`
      );
    }

    return ok(res, result);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.presentationNotFound"), 404);
    if (e instanceof Error && e.message === "INSUFFICIENT_CREDITS") return err(res, apiT(req, "errors.notEnoughCredits"), 402);
    if (e instanceof Error && e.message === "GENERATION_IN_PROGRESS") return err(res, apiT(req, "errors.generationInProgress"), 409);
    if (e instanceof Error && e.message.includes("AI")) return err(res, e.message, 502);
    return err(res, apiT(req, "errors.generationFailed"), 500);
  }
}

function resolveSlideCount(slideCount: number | undefined, presetId: string | undefined): number {
  const requestedCount = slideCount ?? 8;
  if (presetId) {
    const preset = getPreset(presetId);
    if (preset) {
      const min = preset.minSlides ?? preset.slideCount;
      const max = preset.maxSlides ?? preset.slideCount;
      return Math.max(min, Math.min(max, requestedCount));
    }
  }
  return requestedCount;
}
