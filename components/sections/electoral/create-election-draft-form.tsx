"use client";

import { useActionState } from "react";
import { FilePlus2 } from "lucide-react";
import { createElectionDraftAction } from "@/app/actions/create-election-draft";

const field = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

export function CreateElectionDraftForm() {
  const [state, action, pending] = useActionState(createElectionDraftAction, { error: "" });
  return <form action={action} className="mt-8 space-y-6">
    <div>
      <label htmlFor="draft-title" className="mb-2 block text-sm font-bold text-slate-700">Election title</label>
      <input id="draft-title" name="title" minLength={3} maxLength={120} required
        placeholder="Example: 2026 Association Executive Election" className={field}/>
    </div>
    <div>
      <label htmlFor="draft-description" className="mb-2 block text-sm font-bold text-slate-700">Description (optional)</label>
      <textarea id="draft-description" name="description" rows={5} maxLength={2000}
        placeholder="Describe the purpose of this election" className={field}/>
    </div>
    {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{state.error}</p>}
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      The election will remain a draft. Candidate setup, invitations, opening, ballot submissions and publishing are not enabled in this batch.
    </div>
    <button type="submit" disabled={pending}
      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-7 py-3 font-bold text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-60">
      <FilePlus2 className="size-5" aria-hidden="true"/>{pending ? "Creating draft..." : "Create draft election"}
    </button>
  </form>;
}
