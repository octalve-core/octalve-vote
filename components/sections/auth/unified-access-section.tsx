"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, CheckCircle2, LockKeyhole, ShieldCheck, Vote } from "lucide-react";
import { StaffLoginForm } from "@/components/sections/auth/staff-login-form";
import { ElectoralRegisterForm } from "@/components/sections/auth/electoral-register-form";

export type AccessRole = "voter" | "electoral" | "admin";
type Props = {
  role: AccessRole;
  initialMode: "login" | "register";
  staffEnabled: boolean;
  signupEnabled: boolean;
  adminEnabled: boolean;
  emailVerified: boolean;
};

const choices = [
  { role: "voter", label: "Voter", icon: Vote, summary: "Access an election invitation and verify eligibility." },
  { role: "electoral", label: "Electoral Body", icon: Building2, summary: "Register an organization or manage elections." },
  { role: "admin", label: "Platform Admin", icon: ShieldCheck, summary: "Securely review organizations and platform operations." }
] as const;

export function UnifiedAccessSection({
  role, initialMode, staffEnabled, signupEnabled, adminEnabled, emailVerified
}: Props) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const isElectoral = role === "electoral";
  const available = role === "admin" ? adminEnabled : staffEnabled;
  return <main className="min-h-[75vh] bg-gradient-to-br from-slate-50 via-indigo-50/50 to-emerald-50/40 px-4 py-12 sm:px-6 sm:py-20">
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <Link href="/" className="text-sm font-semibold text-indigo-700 hover:underline">← Back to home</Link>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">One secure entrance</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Choose how you participate in Octalve Vote. Permissions are enforced on the server for each role.
        </p>
      </div>
      <nav aria-label="Choose account role" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {choices.map(choice => <Link key={choice.role} href={`/auth?role=${choice.role}`}
          aria-current={choice.role === role ? "page" : undefined}
          className={"flex min-h-28 items-start gap-3 rounded-2xl border p-5 transition hover:border-indigo-400 " +
            (role === choice.role ? "border-indigo-500 bg-white shadow-lg ring-2 ring-indigo-100" : "border-slate-200 bg-white/80")}>
          <span className={"rounded-xl p-3 " + (role === choice.role ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600")}>
            <choice.icon className="size-5" aria-hidden="true" />
          </span>
          <span><span className="block text-sm font-bold text-slate-900">{choice.label}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{choice.summary}</span></span>
        </Link>)}
      </nav>
      <div className="mx-auto mt-7 max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-indigo-950/5 sm:p-10">
        {role === "voter" ? <>
          <div className="flex items-center gap-3"><Vote className="size-8 text-indigo-600" />
            <h2 className="text-2xl font-extrabold">Your vote, your voice.</h2></div>
          <p className="mt-4 leading-7 text-slate-600">
            Eligible voters will open a verified election invitation and complete a one-time eligibility check.
          </p>
          <div role="status" className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            Voter sign-in, OTP delivery and ballot submission are intentionally unavailable during security review.
            No voter credentials or votes are collected through this page.
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
            <LockKeyhole className="size-4" /> Voting remains disabled until independent security testing is complete.
          </div>
        </> : <>
          <div className="flex items-center gap-3">
            {isElectoral ? <Building2 className="size-8 text-green-700"/> : <ShieldCheck className="size-8 text-indigo-600"/>}
            <h2 className="text-2xl font-extrabold">{isElectoral ? "Electoral Body Portal" : "Platform Administrator"}</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{isElectoral
            ? "Sign in to your organization's workspace or submit an application for independent review."
            : "Authorized personnel only. Administrators require a provisioned account and authenticator verification."}</p>
          {emailVerified && isElectoral && <p role="status" className="mt-5 flex gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
            <CheckCircle2 className="size-5" /> Organization email verified. Sign in to continue.
          </p>}
          {isElectoral && <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Electoral access">
            <button role="tab" type="button" aria-selected={mode === "login"} onClick={() => setMode("login")}
              className={"rounded-lg py-3 text-sm font-bold " + (mode === "login" ? "bg-white text-green-700 shadow-sm" : "text-slate-600")}>Sign in</button>
            <button role="tab" type="button" aria-selected={mode === "register"} onClick={() => setMode("register")}
              className={"rounded-lg py-3 text-sm font-bold " + (mode === "register" ? "bg-white text-green-700 shadow-sm" : "text-slate-600")}>Register</button>
          </div>}
          {isElectoral && mode === "register" ? <ElectoralRegisterForm enabled={signupEnabled}/> :
            <StaffLoginForm key={role} role={isElectoral ? "electoral" : "admin"} enabled={available}/>}
          {role === "admin" && <p className="mt-6 text-center text-xs leading-6 text-slate-500">
            Administrators cannot register publicly. Access requires independently provisioned credentials and MFA.
          </p>}
        </>}
      </div>
    </div>
  </main>;
}
