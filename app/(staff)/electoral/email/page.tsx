import type { Metadata } from "next";
import Link from "next/link";
import { requireStaffRole } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { EmailStatusPanel } from "@/components/sections/electoral/email-status-panel";

export const metadata: Metadata = { title: "Organization email verification" };
export default async function EmailVerificationStatus() {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const body = await getDb().electoralBody.findUnique({
    where: { id: account.electoralBodyId! }, select: { email: true, emailVerifiedAt: true }
  });
  const testInbox = process.env.CI_ELECTORAL_INTEGRATION === "true" &&
    process.env.ENABLE_CI_MAILBOX_LINK === "true" &&
    process.env.SMTP_HOST === "127.0.0.1";
  return <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <h1 className="text-3xl font-extrabold">Email verification</h1>
    <p className="mt-2 text-slate-600">Registered address: {body?.email ?? "Unavailable"}</p>
    <EmailStatusPanel verified={Boolean(body?.emailVerifiedAt)}/>
    {testInbox && <Link href="http://127.0.0.1:8025" target="_blank" rel="noopener noreferrer"
      className="mt-5 inline-block rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700">
      Open isolated test inbox
    </Link>}
  </main>;
}
