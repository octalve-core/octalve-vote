import type { Metadata } from "next";
import { Users } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Voters" };
export default async function VotersPage() {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const body = account.electoralBody;
  if (!body) return null;
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div className="flex items-center gap-4"><Users className="size-9 text-green-600" /><div><h1 className="text-3xl font-bold">Voters</h1><p className="mt-1 text-slate-500">Secure, election-specific voter management</p></div></div>
    <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm"><h2 className="text-xl font-bold">Voter register access is not enabled yet</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">We are rebuilding import, unique voter credential delivery and eligibility verification so that no raw OTPs or voter data are exposed through browser entity queries.</p></div>
  </main>;
}
