import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffRole } from "@/lib/auth/session";
import { getOwnedVoterRegister } from "@/lib/electoral/voter-register";
import { VoterRegisterForms } from "@/components/sections/electoral/voter-register-forms";
import { getDb } from "@/lib/db/client";

export const metadata: Metadata = { title: "Election voter register" };
export default async function VoterRegisterPage({ params }: { params: Promise<{ electionId: string }> }) {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const { electionId } = await params;
  const election = await getOwnedVoterRegister(account.electoralBodyId!, electionId);
  if (!election) notFound();
  const body = await getDb().electoralBody.findUnique({
    where: { id: account.electoralBodyId! },
    select: { status: true, paymentStatus: true, emailVerifiedAt: true }
  });
  const editable = process.env.ENABLE_VOTER_REGISTER === "true" &&
    election.status === "DRAFT" && body?.status === "APPROVED" &&
    body.paymentStatus === "PAID" && Boolean(body.emailVerifiedAt);
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <Link href="/electoral/voters" className="text-sm font-semibold text-green-700 hover:underline">← All voter registers</Link>
    <h1 className="mt-6 text-3xl font-extrabold">{election.title}</h1>
    <p className="mt-3 text-slate-600">Registered: {election._count.voters} · Election state: {election.status}</p>
    {editable ? <VoterRegisterForms electionId={election.id}/> :
      <p role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Editing requires a draft election, approved and paid organization, verified organization email and an enabled review environment.
      </p>}
    <section className="mt-10 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <h2 className="border-b border-slate-100 p-6 text-xl font-bold">Voter register (most recent 200)</h2>
      {election.voters.length ? <ul className="divide-y divide-slate-100">{election.voters.map(v => <li key={v.id}
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div><p className="font-semibold text-slate-900">{v.fullName}</p><p className="mt-1 text-sm text-slate-600">{v.email}</p></div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">{v.isActive ? "Eligible" : "Inactive"}</span>
      </li>)}</ul> : <p className="p-8 text-slate-500">No voters registered yet.</p>}
    </section>
  </main>;
}
