import { sendEmail } from "@/lib/email";

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendEmail({
    to,
    subject: "SlideMind — Verify your email",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <h2 style="margin:0 0 16px">Verify your email</h2>
        <p style="color:#555;margin:0 0 24px">Click the button below to activate your SlideMind account.</p>
        <a href="${url}" style="display:inline-block;background:#AB3E16;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600">Verify Email</a>
        <p style="color:#999;font-size:13px;margin:24px 0 0">This link expires in 24 hours. If you didn't sign up, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail({
    to,
    subject: "SlideMind — Reset your password",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <h2 style="margin:0 0 16px">Reset your password</h2>
        <p style="color:#555;margin:0 0 24px">Click the button below to choose a new password.</p>
        <a href="${url}" style="display:inline-block;background:#AB3E16;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600">Reset Password</a>
        <p style="color:#999;font-size:13px;margin:24px 0 0">This link expires in 1 hour. If you didn't request a password reset, ignore this email.</p>
      </div>
    `,
  });
}
