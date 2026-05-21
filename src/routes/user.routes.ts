import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as ctrl from "@/controllers/user.controller";

const router = Router();

router.use(authenticate);

router.get("/profile",         ctrl.getProfile);
router.put("/profile",         ctrl.updateProfile);
router.put("/change-password", ctrl.changePassword);
router.get("/referral",        ctrl.getReferralStats);

export default router;
