"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, ChevronRight, LockKeyhole, ShieldCheck, Vote } from "lucide-react";
import { StaffLoginForm } from "@/components/sections/auth/staff-login-form";
import { ElectoralRegisterForm } from "@/components/sections/auth/electoral-register-form";
import { VoteIllustration } from "@/components/sections/auth/vote-illustration";

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
  { role: "voter", label: "I'm a voter", description: "Participate in an election", icon: Vote },
  { role: "electoral", label: "I'm an electoral body", description: "Manage an organization's elections", icon: Building2 },
  { role: "admin", label: "I'm a platform admin", description: "Review platform operations", icon: ShieldCheck }
] as const;

export function UnifiedAccessSection({
  role, initialMode, staffEnabled, signupEnabled, adminEnabled, emailVerified
}: Props) {
  const [step, setStep] = useState<"choose" | "access">(emailVerified ? "access" : "choose");
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const isElectoral = role === "electoral";
  const available = role === "admin" ? adminEnabled : staffEnabled;
  return <main className="flex min-h-svh items-center justify-center bg-[#efeff2] px-3 py-4 sm:px-6 sm:py-10 xl:px-12">
    <div className="grid w-full max-w-[1380px] overflow-hidden rounded-[28px] bg-white shadow-[0_25px_90px_rgba(26,15,64,0.09)] lg:min-h-[790px] lg:grid-cols-[49%_51%] lg:rounded-[38px]">
      <div className="flex min-h-[650px] flex-col px-6 py-8 sm:px-10 sm:py-10 lg:min-h-[790px] lg:px-14 xl:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Octalve Vote homepage" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-[#6829d8] text-white shadow-[0_6px_18px_rgba(104,41,216,0.22)]">
              <Vote className="size-5" strokeWidth={2.5}/>
            </span>
            <span className="text-[20px] font-extrabold tracking-[-0.8px] text-[#16112b]">Octalve <span className="text-[#6e2ad4]">Vote</span></span>
          </Link>
          <Link href="/" className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-[#6e2ad4]">Back to home</Link>
        </div>

        <div className={"mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center " + (step === "choose" ? "py-12" : "py-7")}>
          {step === "choose" ? <>
            <div className="mb-10">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#7535d5]">A better way to vote</p>
              <h1 className="max-w-sm text-[34px] font-extrabold leading-[1.12] tracking-[-1.7px] text-[#15112d] sm:text-[43px]">Welcome to<br/>Octalve Vote</h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#85839a]">Secure access for voters, electoral bodies and administrators. Tell us how you&apos;ll be using the platform.</p>
            </div>

            <nav aria-label="Choose account role" className="space-y-3">
              {choices.map(choice => {
                const selected = role === choice.role;
                return <Link key={choice.role} href={`/auth?role=${choice.role}`} aria-current={selected ? "page" : undefined}
                  onClick={() => { setStep("choose"); setMode("login"); }}
                  className={"group flex min-h-[72px] items-center gap-3.5 rounded-xl border px-4 py-3 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7330de] " +
                    (selected ? "border-[#7130df] bg-[#faf7ff] shadow-[0_0_0_1px_rgba(113,48,223,0.16)]" : "border-[#e6e4ed] bg-white hover:border-[#b9a0ee] hover:bg-[#fcfbff]")}>
                  <span aria-hidden="true" className={"grid size-[19px] shrink-0 place-items-center rounded-full border-2 " + (selected ? "border-[#6f2bd9]" : "border-[#a8a5b4]")}>
                    {selected && <span className="size-[9px] rounded-full bg-[#6f2bd9]"/>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={"block text-sm font-semibold " + (selected ? "text-[#37205f]" : "text-[#777488]")}>{choice.label}</span>
                    <span className="mt-0.5 block text-xs text-[#a3a0ad]">{choice.description}</span>
                  </span>
                  {selected ? <ChevronRight className="size-4 shrink-0 text-[#6f2bd9]"/> : <choice.icon className="size-4 shrink-0 text-[#a7a3b5]"/>}
                </Link>;
              })}
            </nav>
            <button type="button" onClick={() => setStep("access")}
              className="mt-8 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#6924d9] text-sm font-bold text-white shadow-[0_9px_24px_rgba(105,36,217,0.18)] transition hover:bg-[#5820bb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6924d9]">
              Continue <ArrowRight className="size-4"/>
            </button>
            <p className="mt-5 text-center text-sm text-[#9491a3]">Already have an account?{" "}
              <button type="button" onClick={() => { setMode("login"); setStep("access"); }}
                className="font-bold text-[#462d6c] hover:text-[#6924d9] hover:underline">Log in</button>
            </p>
          </> : <>
            <button type="button" onClick={() => setStep("choose")}
              className="mb-8 inline-flex w-fit items-center gap-2 text-xs font-bold text-[#7552a2] hover:text-[#6126c4]">
              <ArrowLeft className="size-4"/> Change your role
            </button>
            {role === "voter" ? <>
              <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#f0e9ff] text-[#6924d9]"><Vote className="size-6"/></span>
              <h1 className="text-[31px] font-extrabold tracking-[-1px] text-[#15112d]">Your vote, your voice.</h1>
              <p className="mt-3 text-sm leading-7 text-[#77738a]">Voter access will open after confidential ballot submission and voter-eligibility checks pass security review.</p>
              <div role="status" className="mt-7 rounded-2xl border border-[#e7d7fd] bg-[#f9f5ff] p-5 text-sm leading-7 text-[#564277]">
                Voter sign-in, OTP delivery and ballot submission are intentionally unavailable during security review. No votes or voter credentials are collected here.
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#726588]"><LockKeyhole className="size-4"/> Voting is currently disabled.</p>
            </> : <>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7535d5]">{isElectoral ? "Organization access" : "Restricted access"}</p>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-[-1px] text-[#15112d]">{isElectoral ? "Electoral Body Portal" : "Platform Administrator"}</h1>
              <p className="mt-3 text-sm leading-6 text-[#77738a]">{isElectoral
                ? "Sign in to manage your organization, or submit an application for independent review."
                : "Only provisioned administrators with password and authenticator verification can sign in."}</p>
              {emailVerified && isElectoral && <p role="status" className="mt-4 flex gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-800">
                <CheckCircle2 className="size-4 shrink-0" /> Organization email verified. Sign in to continue.
              </p>}
              {isElectoral && <div className="mt-6 grid grid-cols-2 rounded-xl bg-[#f3f0f8] p-1" role="tablist" aria-label="Electoral access">
                <button role="tab" type="button" aria-selected={mode === "login"} onClick={() => setMode("login")}
                  className={"rounded-lg py-2.5 text-sm font-bold transition " + (mode === "login" ? "bg-white text-[#6124cb] shadow-sm" : "text-[#888197] hover:text-[#6b32c9]")}>Sign in</button>
                <button role="tab" type="button" aria-selected={mode === "register"} onClick={() => setMode("register")}
                  className={"rounded-lg py-2.5 text-sm font-bold transition " + (mode === "register" ? "bg-white text-[#6124cb] shadow-sm" : "text-[#888197] hover:text-[#6b32c9]")}>Register</button>
              </div>}
              {isElectoral && mode === "register" ? <ElectoralRegisterForm enabled={signupEnabled}/> :
                <StaffLoginForm key={role} role={isElectoral ? "electoral" : "admin"} enabled={available}/>}
              {role === "admin" && <p className="mt-4 text-xs leading-6 text-[#8b8399]">Administrator access cannot be self-registered. MFA remains mandatory.</p>}
            </>}
          </>}
        </div>
        <div aria-hidden="true" className="flex items-center gap-2.5 pb-0.5">
          <span className={"h-1.5 w-[74px] rounded-full " + (step === "choose" ? "bg-[#6c27da]" : "bg-[#e6e1ee]")}/>
          <span className={"h-1.5 w-[74px] rounded-full " + (step === "access" ? "bg-[#6c27da]" : "bg-[#e6e1ee]")}/>
          <span className="h-1.5 w-[74px] rounded-full bg-[#e6e1ee]"/>
        </div>
      </div>
      <aside className="hidden p-3 lg:block">
        <VoteIllustration/>
      </aside>
    </div>
  </main>;
}
