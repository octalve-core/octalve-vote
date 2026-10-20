"use client";

import { useActionState } from "react";
import { requestOrganizationEmailVerification } from "@/app/actions/email-verification";

export function EmailStatusPanel({ verified }: { verified: boolean }) {
  const [state, action, pending] = useActionState(requestOrganizationEmailVerification, { error: "", success: "" });
  return <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
    <h2 className="text-xl font-extrabold">{verified ? "Email verified" : "Verify your organization email"}</h2>
    <p className="mt-3 leading-7 text-slate-600">{verified
      ? "The registered organization email has been verified. A separate administrator approval is still required."
      : "We will email a single-use link to your organization's registered address. The link expires in 20 minutes."}</p>
    {!verified && <form action={action} className="mt-6">
      <button disabled={pending} type="submit"
        className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60">
        {pending ? "Sending..." : "Send verification email"}
      </button>
    </form>}
    {state.error && <p role="alert" className="mt-4 text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="mt-4 text-sm font-semibold text-green-700">{state.success}</p>}
  </section>;
}
