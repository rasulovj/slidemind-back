import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";

const PLAN_LIMITS = {
  FREE:  { presentations: 5,   aiGenerations: 10  },
  PRO:   { presentations: 100, aiGenerations: 100 },
  PREMIUM:  { presentations: 500, aiGenerations: 500 },
};

export async function getBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, plan: true },
  });
  if (!user) throw new Error("NOT_FOUND");
  return {
    credits: user.credits,
    plan: user.plan,
    limits: PLAN_LIMITS[user.plan],
  };
}

export async function getTransactions(userId: string, limit = 20) {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function topUp(userId: string, pack: string) {
  const PACKS: Record<string, { credits: number; label: string }> = {
    starter: { credits: 50,   label: "Starter pack — 50 credits"   },
    popular: { credits: 200,  label: "Popular pack — 200 credits"  },
    power:   { credits: 500,  label: "Power pack — 500 credits"    },
    ultimate:{ credits: 1000, label: "Ultimate pack — 1000 credits" },
  };

  const chosen = PACKS[pack];
  if (!chosen) throw new Error("INVALID_PACK");

  const [, transaction] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: chosen.credits } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        type: "TOPUP",
        amount: chosen.credits,
        description: chosen.label,
        reference: `mock_${Date.now()}`,
      },
    }),
  ]);

  return transaction;
}

export async function upgradePlan(userId: string, plan: Plan) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  if (!user) throw new Error("NOT_FOUND");
  if (user.plan === plan) throw new Error("ALREADY_ON_PLAN");

  const PLAN_BONUS: Record<string, number> = { PRO: 100, PREMIUM: 300 };
  const bonus = PLAN_BONUS[plan] ?? 0;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        ...(bonus > 0 ? { credits: { increment: bonus } } : {}),
      },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        type: "BONUS",
        amount: bonus,
        description: `Upgraded to ${plan} plan — ${bonus} bonus credits`,
        reference: `plan_upgrade_${plan.toLowerCase()}`,
      },
    }),
  ]);

  return { plan, bonusCredits: bonus };
}

export async function deductCredit(userId: string, amount = 1, description = "AI presentation generated") {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
  if (!user) throw new Error("NOT_FOUND");
  if (user.credits < amount) throw new Error("INSUFFICIENT_CREDITS");

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
    }),
    prisma.creditTransaction.create({
      data: { userId, type: "USAGE", amount: -amount, description },
    }),
  ]);
}
