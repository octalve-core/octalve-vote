"use client";

import { useActionState } from "react";
import { confirmOrganizationEmailVerification } from "@/app/actions/email-verification";

export function VerifyEmailForm({ token }: { token: string }) {
  const [state, submit, pending] = useActionState(confirmOrganizationEmailVerification, { error: "", success: "" });
  return <form action={submit} className="mt-8 space-y-5">
    <input name="token" type="hidden" value={token}/>
    <p className="text-sm leading-7 text-slate-600">Selecting Verify will confirm access to the registered email. The link is valid once and expires after 20 minutes.</p>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white disabled:opacity-50">
      {pending ? "Verifying..." : "Verify organization email"}
    </button>
  </form>;
}
