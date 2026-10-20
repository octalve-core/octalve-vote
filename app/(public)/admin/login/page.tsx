import type { Metadata } from "next";
import { RoleEntrySection } from "@/components/sections/role-entry/role-entry-section";
export const metadata: Metadata = { title: "Platform administration" };
export default function Page() { return <RoleEntrySection role="admin" />; }
