import "server-only";

import nodemailer from "nodemailer";

/** Outbound email is always real SMTP; no pretend-success / console tokens. */
export function emailTransportEnabled(): boolean {
  return process.env.ENABLE_EMAIL_VERIFICATION === "true" &&
    Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM && process.env.APP_ORIGIN);
}
export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  if (!emailTransportEnabled()) throw new Error("Email delivery not configured");
  const url = new URL(process.env.APP_ORIGIN!);
  const localCI = process.env.CI_ELECTORAL_INTEGRATION === "true" &&
    ["127.0.0.1", "localhost"].includes(url.hostname);
  if (url.protocol !== "https:" && !localCI) throw new Error("Email origin must use HTTPS");
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/")
    throw new Error("APP_ORIGIN must be the bare origin");
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT ?? 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid SMTP port");
  const secure = port === 465;
  const testRelay = localCI && host === "127.0.0.1" && port === 1025;
  if (!secure && !testRelay && port !== 587) throw new Error("SMTP must use 465 or 587");
  if (!testRelay && (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD))
    throw new Error("SMTP credentials missing");

  const verificationUrl = new URL("/electoral/verify-email", url);
  verificationUrl.searchParams.set("token", token);
  const transporter = nodemailer.createTransport({
    host, port, secure, requireTLS: !secure && !testRelay,
    auth: testRelay ? undefined : { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASSWORD! },
    connectionTimeout: 12000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM!,
    to,
    subject: "Verify your Octalve Vote organization email",
    text: "Confirm your organization's email address by opening the link below, then selecting Verify.\n\n" +
      verificationUrl.toString() +
      "\n\nThis link expires in 20 minutes and can be used once. If you did not request this, ignore it.",
    html: `<p>Confirm your organization email for Octalve Vote.</p><p><a href="${verificationUrl.toString()}">Verify organization email</a></p><p>This link expires in 20 minutes and can be used once. If you did not request this, ignore it.</p>`
  });
}
