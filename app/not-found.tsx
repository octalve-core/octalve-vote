import Link from "next/link";
export default function NotFound() {
  return <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-5 px-5 text-center"><h1 className="text-4xl font-extrabold">This page isn’t available</h1><p className="text-slate-600">That route may belong to a workflow not yet enabled in Octalve Vote.</p><Link className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700" href="/">Return home</Link></main>;
}
