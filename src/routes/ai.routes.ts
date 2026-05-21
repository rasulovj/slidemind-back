import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate } from "@/middleware/validate";
import { GeneratePresentationSchema, SUPPORTED_LANGUAGES } from "@/validations/ai.validation";
import * as ctrl from "@/controllers/ai.controller";
import { ok } from "@/utils/response";
import { getCatalogIcons, getIconCategories } from "@/lib/templates/icons";

const router = Router();

router.get("/languages", (_req, res) => {
  const languages = SUPPORTED_LANGUAGES.map((code) => {
    const names: Record<string, { name: string; nativeName: string }> = {
      en: { name: "English", nativeName: "English" },
      uz: { name: "Uzbek (Latin)", nativeName: "O'zbek" },
      uz_cyrl: { name: "Uzbek (Cyrillic)", nativeName: "Ўзбек" },
      ru: { name: "Russian", nativeName: "Русский" },
      tr: { name: "Turkish", nativeName: "Türkçe" },
    };
    return { code, ...names[code] };
  });
  return ok(res, { languages });
});

router.get("/icons", (req, res) => {
  const category = req.query.category as string | undefined;
  const icons = getCatalogIcons(category);
  const categories = getIconCategories();
  return ok(res, { icons, categories });
});

router.use(authenticate);

router.post("/generate-presentation", validate(GeneratePresentationSchema), ctrl.generatePresentation);

export default router;
