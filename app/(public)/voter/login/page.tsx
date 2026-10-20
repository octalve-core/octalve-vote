import type { Metadata } from "next";
import { RoleEntrySection } from "@/components/sections/role-entry/role-entry-section";
export const metadata: Metadata = { title: "Voter portal" };
export default function Page() { return <RoleEntrySection role="voter" />; }
