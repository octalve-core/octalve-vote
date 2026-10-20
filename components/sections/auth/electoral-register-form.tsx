"use client";

import { useActionState } from "react";
import { electoralRegisterAction } from "@/app/actions/staff-auth";

const inputStyle = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-green-600 disabled:bg-slate-100";
const labelStyle = "mb-2 block text-sm font-semibold text-slate-700";

export function ElectoralRegisterForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(electoralRegisterAction, { error: "" });
  return <form action={action} className="mt-8 grid gap-5 sm:grid-cols-2">
    <div className="sm:col-span-2"><label htmlFor="org-name" className={labelStyle}>Organization name</label><input id="org-name" name="organization" required minLength={2} maxLength={140} disabled={!enabled} className={inputStyle} /></div>
    <div><label htmlFor="contact-person" className={labelStyle}>Contact person</label><input id="contact-person" name="contactPerson" required minLength={2} maxLength={120} disabled={!enabled} className={inputStyle} /></div>
    <div><label htmlFor="reg-phone" className={labelStyle}>Phone (optional)</label><input id="reg-phone" name="phone" type="tel" maxLength={40} disabled={!enabled} className={inputStyle} /></div>
    <div className="sm:col-span-2"><label htmlFor="reg-email" className={labelStyle}>Email address</label><input id="reg-email" name="email" type="email" autoComplete="email" required disabled={!enabled} className={inputStyle} /></div>
    <div><label htmlFor="reg-password" className={labelStyle}>Password (12+ characters)</label><input id="reg-password" name="password" type="password" autoComplete="new-password" minLength={12} required disabled={!enabled} className={inputStyle} /></div>
    <div><label htmlFor="reg-confirm" className={labelStyle}>Confirm password</label><input id="reg-confirm" name="confirm" type="password" autoComplete="new-password" minLength={12} required disabled={!enabled} className={inputStyle} /></div>
    <div className="sm:col-span-2"><label htmlFor="reg-plan" className={labelStyle}>Subscription category (not a payment)</label>
      <select name="plan" id="reg-plan" className={inputStyle} disabled={!enabled} defaultValue="PERSONAL">
        <option value="PERSONAL">Personal</option><option value="ORGANIZATIONAL">Organizational</option><option value="UNLIMITED">Unlimited</option>
      </select>
      <p className="mt-2 text-xs text-slate-500">Selection does not activate a subscription. Account approval and payment verification remain separate.</p>
    </div>
    {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{state.error}</p>}
    <div className="sm:col-span-2"><button disabled={!enabled || pending} className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 font-bold text-white hover:from-green-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Submitting..." : "Create pending organization account"}</button></div>
    {!enabled && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 sm:col-span-2">Organization registration is closed in this review environment. This form will become available after backend configuration and verification.</p>}
  </form>;
}
