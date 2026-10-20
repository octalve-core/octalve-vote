"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { StaffLoginForm } from "./staff-login-form";
import { ElectoralRegisterForm } from "./electoral-register-form";

export function ElectoralAuthSection({ loginEnabled, signupEnabled }: { loginEnabled: boolean; signupEnabled: boolean }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  return <main className="min-h-[75vh] bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/30 px-5 py-16">
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-green-950/5 md:p-10">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white"><Building2 className="size-7" /></span>
      <h1 className="mt-5 text-center text-3xl font-extrabold">Electoral Body Portal</h1>
      <p className="mt-3 text-center text-sm leading-6 text-slate-600">Sign in or submit your organization for review. Accounts remain pending until independently approved.</p>
      <div className="mt-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Electoral access">
        <button type="button" role="tab" aria-selected={tab === "login"} onClick={() => setTab("login")} className={"rounded-lg py-3 text-sm font-bold " + (tab === "login" ? "bg-white text-green-700 shadow-sm" : "text-slate-600")}>Sign in</button>
        <button type="button" role="tab" aria-selected={tab === "register"} onClick={() => setTab("register")} className={"rounded-lg py-3 text-sm font-bold " + (tab === "register" ? "bg-white text-green-700 shadow-sm" : "text-slate-600")}>Register</button>
      </div>
      {tab === "login" ? <StaffLoginForm role="electoral" enabled={loginEnabled} /> : <ElectoralRegisterForm enabled={signupEnabled} />}
    </div>
  </main>;
}
