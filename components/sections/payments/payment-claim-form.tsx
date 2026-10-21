"use client";

import { useActionState } from "react";
import { submitPaymentClaimAction } from "@/app/actions/payment-claims";

const input = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-green-600";
export function PaymentClaimForm({ eligible }: { eligible: boolean }) {
  const [state, action, pending] = useActionState(submitPaymentClaimAction, { error: "", success: "" });
  return <form action={action} className="mt-7 space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold">Submit a bank transfer reference</h2>
    <p className="text-sm leading-6 text-slate-600">Only submit details for a transfer you have actually made. Submission is not evidence of receipt or payment confirmation.</p>
    <div><label className="text-sm font-semibold" htmlFor="transfer-ref">Transfer reference</label>
      <input id="transfer-ref" name="reference" minLength={6} maxLength={80} required disabled={!eligible} className={input} placeholder="BANK-REFERENCE-123"/></div>
    <div><label className="text-sm font-semibold" htmlFor="transfer-amount">Reported amount (NGN)</label>
      <input id="transfer-amount" name="amount" inputMode="decimal" placeholder="15000.00"
        pattern="[1-9][0-9]{0,8}(\.[0-9]{1,2})?" required disabled={!eligible} className={input}/></div>
    <div><label className="text-sm font-semibold" htmlFor="transfer-note">Additional information (optional)</label>
      <textarea id="transfer-note" name="note" rows={3} maxLength={500} disabled={!eligible} className={input}/></div>
    {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm font-semibold text-green-700">{state.success}</p>}
    <button disabled={pending || !eligible} className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white disabled:opacity-40">
      {pending ? "Submitting..." : "Submit unconfirmed claim"}
    </button>
    {!eligible && <p className="text-sm text-amber-700">Verify your organization email before submitting a claim.</p>}
  </form>;
}
