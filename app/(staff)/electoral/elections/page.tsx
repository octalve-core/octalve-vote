import type { Metadata } from "next";
import { Vote } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";
import { getElectoralOverview } from "@/lib/electoral/overview";

export const metadata: Metadata = { title: "Elections" };
export default async function ElectionsPage() {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const body = account.electoralBody;
  if (!body) return null;
  const data = await getElectoralOverview(body.id);
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div className="flex items-center gap-4"><Vote className="size-9 text-green-600" /><div><h1 className="text-3xl font-bold">Elections</h1><p className="mt-1 text-slate-500">Organization-specific election register</p></div></div>
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {data.elections.length
        ? <ul className="divide-y divide-slate-100">{data.elections.map(e => <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 p-5"><span className="font-semibold">{e.title}</span><span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold">{e.status.toLowerCase()}</span></li>)}</ul>
        : <p className="px-8 py-12 text-center text-slate-500">No elections have been created for your organization.</p>}
    </section>
    <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Creation, editing, starting and closing elections are deliberately disabled until role-based lifecycle checks are complete.</p>
  </main>;
}
