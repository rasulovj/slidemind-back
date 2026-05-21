import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate } from "@/middleware/validate";
import { CreatePresentationSchema, UpdatePresentationSchema } from "@/validations/presentation.validation";
import * as ctrl from "@/controllers/presentation.controller";

const router = Router();

// Public share route — no auth
router.get("/share/:token", ctrl.getSharedPresentation);

// All routes below require auth
router.use(authenticate);

router.get("/",               ctrl.listPresentations);
router.post("/",              validate(CreatePresentationSchema), ctrl.createPresentation);
router.get("/:id/export/:format", ctrl.exportPresentation);
router.get("/:id",            ctrl.getPresentation);
router.put("/:id",            validate(UpdatePresentationSchema), ctrl.updatePresentation);
router.delete("/:id",         ctrl.deletePresentation);
router.post("/:id/duplicate", ctrl.duplicatePresentation);
router.post("/:id/share",     ctrl.toggleShare);

export default router;
