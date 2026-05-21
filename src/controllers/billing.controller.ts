import type { Request, Response } from "express";
import * as BillingService from "@/services/billing.service";
import * as TspayService from "@/services/tspay.service";
import { ok, err } from "@/utils/response";
import { apiT } from "@/utils/i18n";
import { logger } from "@/utils/logger";
import type { Plan } from "@prisma/client";

export async function getBalance(req: Request, res: Response) {
  try {
    const data = await BillingService.getBalance(req.user!.userId);
    return ok(res, data);
  } catch {
    return err(res, apiT(req, "errors.failedFetchBalance"), 500);
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit ?? 20), 50);
    const data = await BillingService.getTransactions(req.user!.userId, limit);
    return ok(res, data);
  } catch {
    return err(res, apiT(req, "errors.failedFetchTransactions"), 500);
  }
}

export async function initiateCreditTopUp(req: Request, res: Response) {
  try {
    const { pack } = req.body as { pack: string };
    if (!pack) return err(res, apiT(req, "errors.packRequired"), 400);
    const data = await TspayService.createCreditPackPayment(req.user!.userId, pack);
    return ok(res, data, 201);
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message === "INVALID_PACK") return err(res, apiT(req, "errors.invalidCreditPack"), 400);
    }
    return err(res, apiT(req, "errors.failedInitiatePayment"), 500);
  }
}

export async function initiatePlanUpgrade(req: Request, res: Response) {
  try {
    const { plan } = req.body as { plan: Plan };
    if (!plan) return err(res, apiT(req, "errors.planRequired"), 400);
    const data = await TspayService.createPlanUpgradePayment(req.user!.userId, plan);
    return ok(res, data, 201);
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message === "ALREADY_ON_PLAN") return err(res, apiT(req, "errors.alreadyOnPlan"), 400);
      if (e.message === "INVALID_PLAN") return err(res, apiT(req, "errors.invalidPlan"), 400);
    }
    return err(res, apiT(req, "errors.failedInitiatePayment"), 500);
  }
}

export async function getPaymentStatus(req: Request, res: Response) {
  try {
    const orderId = req.params.orderId as string;
    const data = await TspayService.getPaymentStatus(orderId, req.user!.userId);
    return ok(res, data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") return err(res, apiT(req, "errors.orderNotFound"), 404);
    return err(res, apiT(req, "errors.failedGetPaymentStatus"), 500);
  }
}

// ── TSPay webhook — no auth middleware, uses HMAC signature ──────────────────

export async function tspayWebhook(req: Request, res: Response) {
  const sig = req.headers["x-signature"] as string ?? "";
  const timestamp = req.headers["x-timestamp"] as string ?? "";
  const { method, params } = req.body as {
    method: string;
    params: {
      cheque_id: string;
      order_id: string;
      amount: number;
      merchant_id: string;
      transaction_id?: number;
      additional?: Record<string, unknown>;
    };
  };

  if (!TspayService.verifyWebhookSignature(sig, timestamp, params)) {
    logger.warn({ sig, timestamp, params }, "TSPay webhook: invalid signature");
    return res.status(401).json({ allow: false, reason: apiT(req, "errors.invalidSignature") });
  }

  logger.info({ method, params }, "TSPay webhook received");

  try {
    if (method === "checkPerform") {
      const result = await TspayService.handleCheckPerform(params);
      return res.json(result);
    }

    if (method === "createTransaction") {
      return res.json({ success: true });
    }

    if (method === "performTransaction") {
      const result = await TspayService.handlePerformTransaction(
        params as Parameters<typeof TspayService.handlePerformTransaction>[0]
      );
      return res.json(result);
    }

    logger.warn({ method }, "TSPay webhook: unknown method");
    return res.json({ success: true });
  } catch (e) {
    logger.error({ method, e }, "TSPay webhook handler error");
    return res.status(500).json({ success: false });
  }
}
