import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";
import { logger } from "@/utils/logger";

const TSPAY_API = "https://api.tspay.uz/api";
const MERCHANT_ID = process.env.TSPAY_MERCHANT_ID!;
const WEBHOOK_SECRET = process.env.TSPAY_WEBHOOK_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

// ── Pack / plan definitions ────────────────────────────────────────────────────

export const CREDIT_PACKS: Record<string, { credits: number; amountUzs: number; label: string }> = {
  starter:  { credits: 15,  amountUzs: 3_000,  label: "Starter — 15 credits"   },
  popular:  { credits: 50,  amountUzs: 9_900,  label: "Basic — 50 credits"     },
  power:    { credits: 150, amountUzs: 27_000, label: "Popular — 150 credits"  },
  ultimate: { credits: 400, amountUzs: 69_000, label: "Power — 400 credits"    },
};

export const PLAN_PRICES: Record<string, { amountUzs: number; bonus: number }> = {
  PRO:  { amountUzs: 149_000, bonus: 100 },
  PREMIUM: { amountUzs: 349_000, bonus: 300 },
};

// ── Create payment ─────────────────────────────────────────────────────────────

export async function createCreditPackPayment(userId: string, packId: string) {
  const pack = CREDIT_PACKS[packId];
  if (!pack) throw new Error("INVALID_PACK");

  const order = await prisma.paymentOrder.create({
    data: {
      userId,
      type: "CREDIT_PACK",
      amountUzs: pack.amountUzs,
      credits: pack.credits,
    },
  });

  return callTspayCreate(order.id, pack.amountUzs);
}

export async function createPlanUpgradePayment(userId: string, plan: Plan) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  if (!user) throw new Error("NOT_FOUND");
  if (user.plan === plan) throw new Error("ALREADY_ON_PLAN");

  const price = PLAN_PRICES[plan];
  if (!price) throw new Error("INVALID_PLAN");

  const order = await prisma.paymentOrder.create({
    data: {
      userId,
      type: "PLAN_UPGRADE",
      amountUzs: price.amountUzs,
      plan,
      credits: price.bonus,
    },
  });

  return callTspayCreate(order.id, price.amountUzs);
}

async function callTspayCreate(orderId: string, amountUzs: number) {
  // Fetch the auto-incremented integer orderNum to use as TSPay order_id
  const order = await prisma.paymentOrder.findUnique({
    where: { id: orderId },
    select: { orderNum: true },
  });
  if (!order) throw new Error("ORDER_NOT_FOUND");

  const payload = {
    merchant_id: MERCHANT_ID,
    amount: amountUzs,
    order_id: order.orderNum,
    redirect_url: `${FRONTEND_URL}/balance?payment=done`,
  };
  logger.info({ payload }, "TSPay create transaction request");

  const res = await fetch(`${TSPAY_API}/transactions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const rawText = await res.text().catch(() => "");
    let errBody: unknown = {};
    try { errBody = JSON.parse(rawText); } catch { /* not json */ }
    logger.error({ orderId, status: res.status, err: errBody, rawText }, "TSPay create transaction failed");
    throw new Error((errBody as { detail?: string }).detail ?? `TSPAY_${res.status}`);
  }

  const data = await res.json() as {
    id: number;
    cheque_id: string;
    order_id: number;
    payment_url: string;
    click_pay_url: string;
  };

  await prisma.paymentOrder.update({
    where: { id: orderId },
    data: { chequeId: data.cheque_id, tspayTxId: data.id },
  });

  return { paymentUrl: data.payment_url, chequeId: data.cheque_id, orderId };
}

// ── Webhook signature verification ────────────────────────────────────────────

export function verifyWebhookSignature(
  sig: string,
  timestamp: string,
  params: { order_id?: string | null; amount?: number }
): boolean {
  let amountStr = String(params.amount ?? "");
  if (amountStr !== "" && !amountStr.includes(".")) amountStr += ".0";

  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(`${params.order_id ?? ""}:${amountStr}:${timestamp}`)
      .digest("hex");

  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

// ── checkPerform ──────────────────────────────────────────────────────────────

export async function handleCheckPerform(params: {
  cheque_id: string;
  order_id: string | number;
  amount: number;
  merchant_id: string;
}) {
  const orderNum = Number(params.order_id);
  const order = await prisma.paymentOrder.findUnique({ where: { orderNum } });

  if (!order) return { allow: false, reason: "Order not found" };
  if (order.status !== "PENDING") return { allow: false, reason: "Order already processed" };
  if (order.amountUzs !== params.amount) return { allow: false, reason: "Amount mismatch" };

  return { allow: true, additional: { internalOrderId: order.id } };
}

// ── performTransaction ────────────────────────────────────────────────────────

export async function handlePerformTransaction(params: {
  cheque_id: string;
  order_id: string;
  amount: number;
  merchant_id: string;
  transaction_id: number;
  additional?: { internalOrderId?: string };
}) {
  const orderId = params.additional?.internalOrderId ?? params.order_id;
  const order = await prisma.paymentOrder.findUnique({
    where: { id: orderId },
    include: { user: { select: { id: true, plan: true } } },
  });

  if (!order) {
    logger.error({ params }, "performTransaction: order not found");
    return { success: false };
  }

  // Idempotency — already fulfilled
  if (order.status === "SUCCESS") return { success: true };

  try {
    if (order.type === "CREDIT_PACK") {
      await prisma.$transaction([
        prisma.paymentOrder.update({
          where: { id: order.id },
          data: { status: "SUCCESS", chequeId: params.cheque_id, tspayTxId: params.transaction_id },
        }),
        prisma.user.update({
          where: { id: order.userId },
          data: { credits: { increment: order.credits } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: order.userId,
            type: "TOPUP",
            amount: order.credits,
            description: `Credit top-up via TSPay`,
            reference: params.cheque_id,
          },
        }),
      ]);
    }

    if (order.type === "PLAN_UPGRADE" && order.plan) {
      await prisma.$transaction([
        prisma.paymentOrder.update({
          where: { id: order.id },
          data: { status: "SUCCESS", chequeId: params.cheque_id, tspayTxId: params.transaction_id },
        }),
        prisma.user.update({
          where: { id: order.userId },
          data: {
            plan: order.plan,
            ...(order.credits > 0 ? { credits: { increment: order.credits } } : {}),
          },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: order.userId,
            type: "BONUS",
            amount: order.credits,
            description: `Upgraded to ${order.plan} plan via TSPay`,
            reference: params.cheque_id,
          },
        }),
      ]);
    }

    logger.info({ orderId: order.id, type: order.type }, "Payment fulfilled");
    return { success: true };
  } catch (e) {
    logger.error({ orderId: order.id, e }, "performTransaction DB error");
    return { success: false };
  }
}

// ── Check payment status (polling) ───────────────────────────────────────────

export async function getPaymentStatus(orderId: string, userId: string) {
  const order = await prisma.paymentOrder.findFirst({
    where: { id: orderId, userId },
    select: { status: true, type: true, credits: true, plan: true, chequeId: true },
  });
  if (!order) throw new Error("NOT_FOUND");
  return order;
}
