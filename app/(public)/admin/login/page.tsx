import { redirect } from "next/navigation";

/** Compatibility URL only: every role now shares /auth with separate server authority. */
export default function LegacyLoginEntry() { redirect("/auth?role=admin"); }
