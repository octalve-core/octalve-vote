"use client";

import { useActionState } from "react";
import { approveOrganizationAction } from "@/app/actions/approve-organization";

export function OrganizationReviewCard({ organization }: {
  organization: {
    id: string; name: string; contactPerson: string; email: string;
    emailVerified: boolean; paymentStatus: string; subscriptionType: string;
  };
}) {
  const [result, submit, pending] = useActionState(approveOrganizationAction, { error: "", success: "" });
  return <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-xl font-bold text-slate-900">{organization.name}</h2>
        <p className="mt-2 text-sm text-slate-600">{organization.contactPerson} · {organization.email}</p></div>
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">PENDING</span>
    </div>
    <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
      <span className={"rounded-lg px-3 py-2 " + (organization.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
        Email {organization.emailVerified ? "verified" : "not verified"}
      </span>
      <span className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700">Payment: {organization.paymentStatus}</span>
      <span className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700">{organization.subscriptionType}</span>
    </div>
    <form action={submit} className="mt-6 space-y-3">
      <input type="hidden" name="electoralBodyId" value={organization.id}/>
      <label className="block text-sm font-semibold text-slate-700" htmlFor={`reason-${organization.id}`}>Review justification</label>
      <textarea id={`reason-${organization.id}`} name="reason" rows={2} minLength={10} maxLength={500}
        placeholder="Record how this organization was independently validated" required
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600"/>
      <p className="text-xs text-slate-500">Approval does not confirm or change a payment. Unverified emails cannot be approved.</p>
      {result.error && <p role="alert" className="text-sm font-semibold text-red-700">{result.error}</p>}
      {result.success && <p role="status" className="text-sm font-semibold text-green-700">{result.success}</p>}
      <button type="submit" disabled={pending || !organization.emailVerified}
        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">
        {pending ? "Reviewing..." : "Approve organization"}
      </button>
    </form>
  </article>;
}
