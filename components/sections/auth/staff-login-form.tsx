"use client";

import { useActionState, useState } from "react";
import { LockKeyhole, Mail, LoaderCircle } from "lucide-react";
import { staffLoginAction } from "@/app/actions/staff-auth";

export function StaffLoginForm({ role, enabled }: { role: "electoral" | "admin"; enabled: boolean }) {
  const [state, action, pending] = useActionState(staffLoginAction, { error: "" });
  // Retain only the email across failed server-action submissions. Never retain passwords.
  const [email, setEmail] = useState("");
  return <form action={action} className="mt-8 space-y-5">
    <input type="hidden" name="role" value={role} />
    <div>
      <label htmlFor="staff-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
      <div className="relative"><Mail className="pointer-events-none absolute left-4 top-3.5 size-5 text-slate-400" />
        <input id="staff-email" type="email" name="email" required autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@organization.org" disabled={!enabled} className="w-full rounded-xl border border-slate-200 bg-white px-12 py-3 outline-none focus:border-emerald-600 disabled:bg-slate-100" />
      </div>
    </div>
    <div>
      <label htmlFor="staff-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
      <div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-3.5 size-5 text-slate-400" />
        <input id="staff-password" type="password" name="password" required autoComplete="current-password" disabled={!enabled} className="w-full rounded-xl border border-slate-200 bg-white px-12 py-3 outline-none focus:border-emerald-600 disabled:bg-slate-100" />
      </div>
    </div>
    {role === "admin" && <div>
      <label htmlFor="admin-otp" className="mb-2 block text-sm font-semibold text-slate-700">Authenticator code (6 digits)</label>
      <input id="admin-otp" name="otp" type="text" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} required disabled={!enabled}
        autoComplete="one-time-code" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono tracking-widest focus:border-emerald-600 disabled:bg-slate-100"/>
    </div>}
    {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
    <button disabled={!enabled || pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 font-semibold text-white hover:from-green-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
      {pending && <LoaderCircle className="size-4 animate-spin" />}
      {pending ? "Signing in..." : "Sign in securely"}
    </button>
    {!enabled && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Review preview: staff authentication is disabled until PostgreSQL and required security settings are configured.</p>}
    <p className="text-center text-xs leading-6 text-slate-500">Staff access is verified on the server. Browser sessionStorage is not used as an identity authority.</p>
  </form>;
}
