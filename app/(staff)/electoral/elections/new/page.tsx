import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Vote } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";
import { canCreateDraft } from "@/lib/electoral/draft-policy";
import { CreateElectionDraftForm } from "@/components/sections/electoral/create-election-draft-form";

export const metadata: Metadata = { title: "New draft election" };

export default async function NewElectionPage() {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const body = account.electoralBody;
  if (!body || !canCreateDraft(body.status, body.paymentStatus)) redirect("/electoral/elections");
  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <Link href="/electoral/elections" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline">
      <ArrowLeft className="size-4"/> Back to elections
    </Link>
    <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-green-100 p-3 text-green-700"><Vote className="size-6" /></span>
        <div><h1 className="text-3xl font-extrabold">Create an election</h1>
          <p className="mt-1 text-slate-500">Start with a draft, then configure the remaining steps after review.</p></div>
      </div>
      <CreateElectionDraftForm/>
    </div>
  </main>;
}
