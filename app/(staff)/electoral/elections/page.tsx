import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Vote } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";
import { canCreateDraft } from "@/lib/electoral/draft-policy";
import { getElectoralOverview } from "@/lib/electoral/overview";

export const metadata: Metadata = { title: "Elections" };

export default async function ElectionsPage() {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const body = account.electoralBody;
  if (!body) return null;
  const data = await getElectoralOverview(body.id);
  const canCreate = canCreateDraft(body.status, body.paymentStatus);

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Vote className="size-9 text-green-600" />
        <div><h1 className="text-3xl font-bold">Elections</h1>
          <p className="mt-1 text-slate-500">Organization-specific election register</p></div>
      </div>
      {canCreate && <Link href="/electoral/elections/new"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 font-semibold text-white hover:from-green-700 hover:to-emerald-700">
        <Plus className="size-4"/> Create draft election
      </Link>}
    </div>

    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {data.elections.length
        ? <ul className="divide-y divide-slate-100">
            {data.elections.map(e => <li key={e.id}
              className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div><Link href={`/electoral/elections/${encodeURIComponent(e.id)}`}
                className="font-semibold text-slate-900 hover:text-green-700 hover:underline">
                {e.title}</Link>
              <p className="mt-1 text-xs text-slate-500">View election details</p></div>
              <span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase text-slate-700">{e.status}</span>
            </li>)}
          </ul>
        : <p className="px-8 py-12 text-center text-slate-500">No elections have been created for your organization.</p>}
    </section>
    <p role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      {canCreate
        ? "Draft creation is enabled for approved, paid organizations under an explicitly configured capacity. Editing, starting, closing and publishing remain disabled."
        : "Draft creation is not available: organizational approval, payment verification and review environment configuration are required. Starting, editing and publishing remain disabled."}
    </p>
  </main>;
}
