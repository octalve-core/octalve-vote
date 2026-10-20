import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { StaffLoginForm } from "@/components/sections/auth/staff-login-form";
import { isStaffLoginEnabled } from "@/lib/auth/config";

export const metadata: Metadata = { title: "Platform administrator sign-in" };

export default function PlatformLoginPage() {
  return <main className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 px-5 py-16">
    <div className="mx-auto max-w-lg rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-indigo-950/5 md:p-10">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-600 text-white"><ShieldCheck className="size-7" /></span>
      <h1 className="mt-5 text-center text-3xl font-extrabold">Platform Administrator</h1>
      <p className="mt-3 text-center text-sm leading-6 text-slate-600">Authorized administrator accounts only. Public registration does not create platform administrators.</p>
      <StaffLoginForm role="admin" enabled={false} />
      <p className="mt-6 text-center text-xs text-amber-800">Staff MFA is not implemented in Batch 2. Production administrative sign-in must remain disabled until MFA passes review.</p>
    </div>
  </main>;
}
