import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";
import { staffLogoutAction } from "@/app/actions/staff-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Platform administration" };

export default async function AdminPage() {
  const account = await requireStaffRole("PLATFORM_ADMIN");
  return <main className="min-h-screen bg-slate-50 p-6 md:p-12">
    <section className="mx-auto max-w-4xl rounded-3xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
      <div className="flex justify-between gap-4"><ShieldCheck className="size-10 text-indigo-600" /><form action={staffLogoutAction}><button className="text-sm font-semibold text-indigo-700 hover:underline">Logout</button></form></div>
      <h1 className="mt-6 text-3xl font-extrabold">Platform Administration</h1>
      <p className="mt-3 text-slate-600">Signed in as {account.email}. Administrator identity and role are verified on the server for this page.</p>
      <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">Platform-wide organization approval, payment verification and account management are not enabled in Batch 2. Staff MFA is required before any production administrator access.</div>
    </section>
  </main>;
}
