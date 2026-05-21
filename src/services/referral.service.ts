import { prisma } from "@/lib/prisma";

const REFERRAL_REWARD = 10;

export async function getReferralStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true, referrals: { select: { id: true, fullName: true, email: true, createdAt: true } } },
  });
  if (!user) throw new Error("NOT_FOUND");
  return {
    referralCode: user.referralCode,
    totalReferrals: user.referrals.length,
    creditsEarned: user.referrals.length * REFERRAL_REWARD,
    referrals: user.referrals.map((r) => ({
      name: r.fullName ?? r.email,
      joinedAt: r.createdAt,
    })),
  };
}

export async function applyReferral(newUserId: string, referralCode: string) {
  const referrer = await prisma.user.findUnique({ where: { referralCode } });
  if (!referrer || referrer.id === newUserId) return;

  await prisma.$transaction([
    prisma.user.update({ where: { id: newUserId }, data: { referredBy: referrer.id } }),
    prisma.user.update({ where: { id: referrer.id }, data: { credits: { increment: REFERRAL_REWARD } } }),
    prisma.creditTransaction.create({
      data: {
        userId: referrer.id,
        type: "BONUS",
        amount: REFERRAL_REWARD,
        description: "Referral reward — a friend joined",
        reference: `referral_${newUserId}`,
      },
    }),
  ]);
}
