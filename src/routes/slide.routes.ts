import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate } from "@/middleware/validate";
import { CreateSlideSchema, UpdateSlideSchema, ReorderSlidesSchema } from "@/validations/slide.validation";
import * as ctrl from "@/controllers/slide.controller";

const router = Router();

router.use(authenticate);

router.get("/",              ctrl.listSlides);
router.post("/",             validate(CreateSlideSchema),   ctrl.createSlide);
router.put("/reorder",       validate(ReorderSlidesSchema), ctrl.reorderSlides);
router.put("/:id",           validate(UpdateSlideSchema),   ctrl.updateSlide);
router.delete("/:id",        ctrl.deleteSlide);
router.post("/:id/duplicate", ctrl.duplicateSlide);

export default router;
