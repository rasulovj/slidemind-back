import type { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/utils/response";
import { apiT } from "@/utils/i18n";
import bcrypt from "bcryptjs";

export async function getProfile(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, fullName: true, avatarUrl: true, plan: true, language: true, createdAt: true },
    });
    if (!user) return err(res, apiT(req, "errors.userNotFound"), 404);
    return ok(res, user);
  } catch {
    return err(res, apiT(req, "errors.failedFetchProfile"), 500);
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const { fullName, language } = req.body as { fullName?: string; language?: string };
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(language !== undefined && { language: language as "uz" | "en" | "ru" }),
      },
      select: { id: true, email: true, fullName: true, avatarUrl: true, plan: true, language: true },
    });
    return ok(res, user);
  } catch {
    return err(res, apiT(req, "errors.failedUpdateProfile"), 500);
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
    if (!currentPassword || !newPassword) return err(res, apiT(req, "errors.passwordFieldsRequired"), 400);
    if (newPassword.length < 8) return err(res, apiT(req, "errors.passwordTooShort"), 400);

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user || !user.passwordHash) return err(res, apiT(req, "errors.userNotFound"), 404);

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return err(res, apiT(req, "errors.currentPasswordIncorrect"), 400);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user!.userId }, data: { passwordHash } });
    return ok(res, { message: apiT(req, "messages.passwordUpdated") });
  } catch {
    return err(res, apiT(req, "errors.failedChangePassword"), 500);
  }
}

export async function getReferralStats(req: Request, res: Response) {
  try {
    const { getReferralStats } = await import("@/services/referral.service");
    const data = await getReferralStats(req.user!.userId);
    return ok(res, data);
  } catch {
    return err(res, apiT(req, "errors.failedFetchReferralStats"), 500);
  }
}
