import { Router } from "express";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/utils/response";
import { apiT } from "@/utils/i18n";
import { getAllMeta } from "@/lib/templates/registry";
import { getAllPresets } from "@/lib/templates/presets";

const router = Router();

// Canvas layout metadata — no auth needed
router.get("/layouts", (_req, res) => {
  return ok(res, getAllMeta());
});

// Presentation presets — no auth needed
router.get("/presets", (_req, res) => {
  return ok(res, getAllPresets().map(({ id, name, tagline, description, slideCount, minSlides, maxSlides, accentColor, darkColor, surfaceColor, allowAiTheme }) => ({
    id, name, tagline, description, slideCount, minSlides, maxSlides, accentColor, darkColor, surfaceColor, allowAiTheme,
  })));
});

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const templates = await prisma.template.findMany({
      where: category ? { category: String(category) } : undefined,
      orderBy: { usageCount: "desc" },
    });
    return ok(res, templates);
  } catch {
    return err(res, apiT(req, "errors.failedFetchTemplates"), 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const template = await prisma.template.findUnique({ where: { id: req.params.id } });
    if (!template) return err(res, apiT(req, "errors.templateNotFound"), 404);
    return ok(res, template);
  } catch {
    return err(res, apiT(req, "errors.failedFetchTemplate"), 500);
  }
});

export default router;
