import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";
import { getOwnedElectionConfiguration } from "@/lib/electoral/configuration";
import { PositionForm, CandidateForm } from "@/components/sections/electoral/election-setup-forms";

export const metadata: Metadata = { title: "Election configuration" };

export default async function ElectionDetailPage({ params }: {
  params: Promise<{ electionId: string }>
}) {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const { electionId } = await params;
  const election = await getOwnedElectionConfiguration(account.electoralBodyId!, electionId);
  if (!election) notFound();
  const body = account.electoralBody;
  const editable = process.env.ENABLE_ELECTION_CONFIGURATION === "true" &&
    body?.status === "APPROVED" && body.paymentStatus === "PAID" && election.status === "DRAFT";

  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <Link href="/electoral/elections" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline">
      <ArrowLeft className="size-4"/> Back to elections
    </Link>
    <article className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-green-700">Election configuration</p>
          <h1 className="mt-3 break-words text-3xl font-extrabold">{election.title}</h1></div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase text-slate-700">{election.status}</span>
      </div>
      <p className="mt-6 whitespace-pre-wrap leading-8 text-slate-600">{election.description || "No description was provided."}</p>
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 font-bold text-amber-900"><LockKeyhole className="size-5"/> Voting and publication are disabled</div>
        <p className="mt-2 text-sm leading-7 text-amber-900">Positions and candidates are editable only while this election is a draft, after separate authorization. Enrollment, voting, election opening and results remain unavailable.</p>
      </div>
    </article>

    <section aria-label="Positions and candidates" className="mt-8 space-y-5">
      <h2 className="text-2xl font-extrabold">Positions and candidates</h2>
      {election.positions.length === 0 && <p className="rounded-xl bg-white p-6 text-slate-500">No positions configured yet.</p>}
      {election.positions.map(position => <article key={position.id}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">{position.title}</h3>
        {position.description && <p className="mt-2 text-sm text-slate-600">{position.description}</p>}
        <p className="mt-1 text-xs text-slate-500">One selection per voter</p>
        <ul className="mt-4 divide-y divide-slate-100">
          {position.candidates.map(candidate => <li key={candidate.id} className="py-3">
            <span className="font-semibold">{candidate.name}</span>
            {candidate.manifesto && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{candidate.manifesto}</p>}
          </li>)}
          {!position.candidates.length && <li className="py-3 text-sm text-slate-500">No candidates yet</li>}
        </ul>
      </article>)}
    </section>
    {editable && <section aria-label="Draft configuration forms" className="mt-8 grid gap-6 md:grid-cols-2">
      <PositionForm electionId={election.id}/>
      <CandidateForm electionId={election.id} positions={election.positions.map(p => ({ id: p.id, title: p.title }))}/>
    </section>}
  </main>;
}
