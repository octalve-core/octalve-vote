"use client";

import { useActionState } from "react";
import { reviewPaymentClaimAction } from "@/app/actions/payment-claims";

export function AdminPaymentReviewCard({ claim }: {
  claim: { id: string; reference: string; organization: string; amount: string; note: string | null }
}) {
  const [state, action, pending] = useActionState(reviewPaymentClaimAction, { error: "", success: "" });
  return <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold">{claim.organization}</h2>
    <p className="mt-2 text-sm text-slate-600">Reference: {claim.reference} · ₦{claim.amount}</p>
    {claim.note && <p className="mt-2 text-sm text-slate-600">{claim.note}</p>}
    <form action={action} className="mt-5 space-y-4">
      <input type="hidden" name="claimId" value={claim.id}/>
      <div><label htmlFor={`decision-${claim.id}`} className="block text-sm font-semibold">Review outcome</label>
        <select id={`decision-${claim.id}`} name="decision" className="mt-2 w-full rounded-xl border border-slate-200 p-3">
          <option value="NEEDS_EVIDENCE">Further independent evidence required</option>
          <option value="REJECTED">Reject claim</option>
        </select></div>
      <div><label htmlFor={`reason-${claim.id}`} className="block text-sm font-semibold">Reason (10+ characters)</label>
        <textarea id={`reason-${claim.id}`} name="reason" rows={2} minLength={10} maxLength={500} required
          className="mt-2 w-full rounded-xl border border-slate-200 p-3"/></div>
      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-green-700">{state.success}</p>}
      <button disabled={pending} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white disabled:opacity-50">
        {pending ? "Reviewing..." : "Record review outcome"}
      </button>
    </form>
    <p className="mt-3 text-xs text-amber-800">This action never marks the organization paid.</p>
  </article>;
}
