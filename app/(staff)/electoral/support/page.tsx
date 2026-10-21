import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Support" };
export default async function SupportPage() {
  await requireStaffRole("ELECTORAL_ADMIN");
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div className="flex items-center gap-4"><HelpCircle className="size-9 text-green-600" /><div><h1 className="text-3xl font-bold">Support</h1><p className="mt-1 text-slate-500">Organization help and support</p></div></div>
    <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-10 shadow-sm"><h2 className="text-xl font-bold">Support requests are under migration</h2><p className="mt-3 text-slate-600">The original support workflow relies on Base44 integration. This interface remains read-only until secure ticket ownership and server-side submission are tested.</p></div>
  </main>;
}
