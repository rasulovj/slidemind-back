import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as ctrl from "@/controllers/billing.controller";

const router = Router();

// Public — TSPay calls this directly (HMAC-verified inside handler)
router.post("/webhook", ctrl.tspayWebhook);

// Protected
router.use(authenticate);

router.get("/balance",                ctrl.getBalance);
router.get("/transactions",           ctrl.getTransactions);
router.post("/topup",                 ctrl.initiateCreditTopUp);
router.post("/upgrade",               ctrl.initiatePlanUpgrade);
router.get("/order/:orderId/status",  ctrl.getPaymentStatus);

export default router;
