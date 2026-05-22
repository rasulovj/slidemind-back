import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import { generateToken, hashToken } from "@/utils/crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/services/email.service";
import { applyReferral } from "@/services/referral.service";

const BCRYPT_ROUNDS = 12;

export async function register(data: {
  email: string;
  password: string;
  fullName?: string;
  referralCode?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: data.email, passwordHash, fullName: data.fullName },
  });

  if (data.referralCode) {
    await applyReferral(user.id, data.referralCode).catch(() => {});
  }

  await sendVerifyEmail(user.id, user.email);
  return { id: user.id, email: user.email, fullName: user.fullName };
}

export async function sendVerifyEmail(userId: string, email: string) {
  await prisma.emailVerifyToken.deleteMany({ where: { userId } });

  const raw = generateToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.emailVerifyToken.create({ data: { userId, tokenHash, expiresAt } });
  await sendVerificationEmail(email, raw);
}

export async function verifyEmail(token: string) {
  const tokenHash = hashToken(token);
  const record = await prisma.emailVerifyToken.findUnique({ where: { tokenHash } });

  if (!record || record.expiresAt < new Date()) throw new Error("INVALID_TOKEN");

  const [user] = await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerifyToken.delete({ where: { tokenHash } }),
  ]);

  return issueTokens(user);
}

export async function login(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.passwordHash) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");


  return issueTokens(user);
}

async function issueTokens(user: { id: string; email: string }) {
  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const refreshHash = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: refreshHash },
  });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, fullName: true, avatarUrl: true, plan: true, language: true },
  });

  return { accessToken, refreshToken, user: dbUser };
}

export async function loginWithGoogle(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) throw new Error("GOOGLE_NOT_CONFIGURED");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) throw new Error("GOOGLE_EXCHANGE_FAILED");
  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) throw new Error("GOOGLE_EXCHANGE_FAILED");

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!profileRes.ok) throw new Error("GOOGLE_PROFILE_FAILED");

  const profile = (await profileRes.json()) as {
    id: string;
    email?: string;
    name?: string;
    picture?: string;
    verified_email?: boolean;
  };
  if (!profile.id || !profile.email) throw new Error("GOOGLE_PROFILE_FAILED");

  let user = await prisma.user.findFirst({
    where: {
      OR: [{ googleId: profile.id }, { email: profile.email.toLowerCase() }],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.email.toLowerCase(),
        fullName: profile.name ?? null,
        avatarUrl: profile.picture ?? null,
        authProvider: "GOOGLE",
        googleId: profile.id,
        emailVerified: profile.verified_email ? new Date() : null,
      },
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        authProvider: "GOOGLE",
        googleId: profile.id,
        ...(profile.name ? { fullName: profile.name } : {}),
        ...(profile.picture ? { avatarUrl: profile.picture } : {}),
        ...(profile.verified_email ? { emailVerified: new Date() } : {}),
      },
    });
  }

  return issueTokens({ id: user.id, email: user.email });
}

type TelegramAuthPayload = {
  id: string | number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string | number;
  hash: string;
};

export async function loginWithTelegram(payload: TelegramAuthPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error("TELEGRAM_NOT_CONFIGURED");
  if (!verifyTelegramAuth(payload, botToken)) throw new Error("TELEGRAM_INVALID");

  const telegramId = String(payload.id);
  const authDate = Number(payload.auth_date);
  if (!Number.isFinite(authDate) || Date.now() / 1000 - authDate > 86400) {
    throw new Error("TELEGRAM_EXPIRED");
  }

  const firstName = payload.first_name?.trim() ?? "";
  const lastName = payload.last_name?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || payload.username?.trim() || `Telegram ${telegramId}`;
  const syntheticEmail = `tg_${telegramId}@telegram.local`;

  let user = await prisma.user.findFirst({
    where: {
      OR: [{ telegramId }, { email: syntheticEmail }],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: syntheticEmail,
        fullName,
        avatarUrl: payload.photo_url ?? null,
        authProvider: "TELEGRAM",
        telegramId,
        emailVerified: new Date(),
      },
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        authProvider: "TELEGRAM",
        telegramId,
        fullName,
        avatarUrl: payload.photo_url ?? user.avatarUrl,
        emailVerified: user.emailVerified ?? new Date(),
      },
    });
  }

  return issueTokens({ id: user.id, email: user.email });
}

function verifyTelegramAuth(payload: TelegramAuthPayload, botToken: string) {
  const { hash, ...data } = payload;
  if (!hash) return false;

  const secret = crypto.createHash("sha256").update(botToken).digest();
  const dataCheckString = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && String(value).length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("\n");

  const computed = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  return computed === hash;
}

export async function refresh(token: string) {
  let payload: { userId: string; email: string };
  try {
    payload = verifyRefreshToken(token) as { userId: string; email: string };
  } catch {
    throw new Error("INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user?.refreshToken) throw new Error("INVALID_TOKEN");

  const valid = await bcrypt.compare(token, user.refreshToken);
  if (!valid) throw new Error("INVALID_TOKEN");

  return issueTokens(user);
}

export async function logout(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return; // silent — don't leak user existence

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const raw = generateToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
  await sendPasswordResetEmail(email, raw);
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = hashToken(token);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.expiresAt < new Date() || record.usedAt) {
    throw new Error("INVALID_TOKEN");
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { tokenHash }, data: { usedAt: new Date() } }),
  ]);
}
