import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";
import { getAvailableVoterElections } from "@/lib/electoral/voter-register";

export const metadata: Metadata = { title: "Voter registers" };
export default async function VotersPage() {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const elections = await getAvailableVoterElections(account.electoralBodyId!);
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <div className="flex items-center gap-3"><Users className="size-9 text-green-600"/>
      <div><h1 className="text-3xl font-extrabold">Voter registers</h1>
        <p className="mt-2 text-slate-600">Choose an election to manage eligible voters</p></div></div>
    <p className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
      Registration is a draft-only workflow. Invitations, voter OTP and voting are not enabled, and secret access codes are never displayed in the register.
    </p>
    <section className="mt-8 rounded-2xl border border-slate-100 bg-white shadow-sm">
      {elections.length ? <ul className="divide-y divide-slate-100">{elections.map(e => <li key={e.id} className="flex items-center justify-between gap-4 p-5">
        <div><Link href={`/electoral/voters/${encodeURIComponent(e.id)}`}
          className="font-bold text-slate-800 hover:text-green-700 hover:underline">{e.title}</Link>
          <p className="mt-1 text-sm text-slate-500">{e._count.voters} registered voters</p></div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{e.status}</span>
      </li>)}</ul> : <p className="p-8 text-slate-500">No elections on record.</p>}
    </section>
  </main>;
}
