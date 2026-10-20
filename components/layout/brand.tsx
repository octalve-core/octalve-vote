import Link from "next/link";
import { Vote } from "lucide-react";

export function Brand() {
  return <Link href="/" aria-label="Octalve Vote homepage" className="inline-flex items-center gap-3 rounded-lg text-slate-900">
    <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/15"><Vote className="size-5 text-white" aria-hidden="true" /></span>
    <span className="text-lg font-extrabold tracking-tight">Octalve <span className="text-indigo-600">Vote</span></span>
  </Link>;
}
