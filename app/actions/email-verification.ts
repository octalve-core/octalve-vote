"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { readStaffSession } from "@/lib/auth/session";
import { consumeAuthAttempt } from "@/lib/auth/throttle";
import { getDb } from "@/lib/db/client";
import { emailTransportEnabled, sendVerificationEmail } from "@/lib/email/transport";

export type VerificationState = { error: string; success: string };
const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export async function requestOrganizationEmailVerification(
  _previous: VerificationState, _form: FormData
): Promise<VerificationState> {
  if (!emailTransportEnabled()) return { error: "Email verification is not configured.", success: "" };
  const account = await readStaffSession();
  if (!account || account.role !== "ELECTORAL_ADMIN" || !account.electoralBodyId)
    return { error: "Please sign in as an electoral officer.", success: "" };
  try {
    const db = getDb();
    const body = await db.electoralBody.findUnique({
      where: { id: account.electoralBodyId },
      select: { id: true, email: true, emailVerifiedAt: true, status: true }
    });
    if (!body || body.status === "SUSPENDED")
      return { error: "Account unavailable.", success: "" };
    if (body.emailVerifiedAt) return { error: "", success: "Email is already verified." };
    if (!await consumeAuthAttempt("org-email-verification", body.email, 3))
      return { error: "Too many requests. Try again later.", success: "" };
    const token = randomBytes(32).toString("base64url");
    const now = new Date();
    // One active challenge per organization. All old tokens are invalidated.
    await db.$transaction(async tx => {
      await tx.emailVerificationChallenge.updateMany({
        where: { electoralBodyId: body.id, consumedAt: null },
        data: { consumedAt: now }
      });
      await tx.emailVerificationChallenge.create({
        data: {
          electoralBodyId: body.id,
          tokenHash: digest(token),
          expiresAt: new Date(Date.now() + 20 * 60_000)
        }
      });
    });
    await sendVerificationEmail(body.email, token);
    return { error: "", success: "Verification email sent. Check your inbox and follow the link." };
  } catch {
    return { error: "Unable to send verification email. Retry later.", success: "" };
  }
}

export async function confirmOrganizationEmailVerification(
  _previous: VerificationState, form: FormData
): Promise<VerificationState> {
  const parsed = z.string().min(32).max(128).regex(/^[A-Za-z0-9_-]+$/).safeParse(form.get("token"));
  if (!parsed.success) return { error: "Invalid or expired verification link.", success: "" };
  const db = getDb();
  const now = new Date();
  try {
    await db.$transaction(async tx => {
      const challenge = await tx.emailVerificationChallenge.findUnique({
        where: { tokenHash: digest(parsed.data) }, select: { id: true, electoralBodyId: true }
      });
      if (!challenge) throw new Error("invalid");
      const redeemed = await tx.emailVerificationChallenge.updateMany({
        where: { id: challenge.id, consumedAt: null, expiresAt: { gt: now } },
        data: { consumedAt: now }
      });
      if (redeemed.count !== 1) throw new Error("used-or-expired");
      await tx.electoralBody.update({
        where: { id: challenge.electoralBodyId },
        data: { emailVerifiedAt: now }
      });
      await tx.emailVerificationChallenge.updateMany({
        where: { electoralBodyId: challenge.electoralBodyId, consumedAt: null },
        data: { consumedAt: now }
      });
    });
  } catch {
    return { error: "This link has expired or was already used. Request a new one.", success: "" };
  }
  revalidatePath("/electoral/email");
  redirect("/auth?role=electoral&email_verified=1");
}
