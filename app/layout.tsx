import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Octalve Vote", template: "%s | Octalve Vote" },
  description: "Octalve Vote — an organization-focused digital election platform under development.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="min-h-screen bg-white font-sans text-slate-900 antialiased">{children}</body></html>;
}
