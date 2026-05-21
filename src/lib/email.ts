import { Resend } from "resend";
import { logger } from "@/utils/logger";

export const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@slidemind.uz";

let _resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const client = getResend();
  if (!client) {
    logger.warn({ to: opts.to, subject: opts.subject }, "Email skipped — RESEND_API_KEY not set");
    return;
  }
  await client.emails.send({ from: EMAIL_FROM, ...opts });
}
