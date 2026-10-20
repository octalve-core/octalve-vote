import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";
import { findOwnedElection } from "@/lib/electoral/election-details";

export const metadata: Metadata = { title: "Election details" };

export default async function ElectionDetailPage({ params }: {
  params: Promise<{ electionId: string }>
}) {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const { electionId } = await params;
  const election = await findOwnedElection(account.electoralBodyId!, electionId);
  if (!election) notFound(); // Identical response for missing vs other organization's IDs.

  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <Link href="/electoral/elections" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline">
      <ArrowLeft className="size-4"/> Back to elections
    </Link>
    <article className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-green-700">Election overview</p>
          <h1 className="mt-3 break-words text-3xl font-extrabold">{election.title}</h1></div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase text-slate-700">{election.status}</span>
      </div>
      <p className="mt-6 whitespace-pre-wrap leading-8 text-slate-600">{election.description || "No description was provided."}</p>
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 font-bold text-amber-900"><LockKeyhole className="size-5"/> Read-only in Batch 4</div>
        <p className="mt-2 text-sm leading-7 text-amber-900">Start, edit, candidate nomination, deletion, voter imports and results controls are not enabled yet. A saved draft does not grant voting access.</p>
      </div>
    </article>
  </main>;
}
