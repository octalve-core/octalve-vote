"use server";

import { randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { readStaffSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export type RegisterState = { error: string; success: string };
const person = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254).transform(v => v.toLowerCase().trim()),
  phone: z.string().trim().max(40).default("")
});
const identifier = z.string().cuid();
type VoterRecord = z.infer<typeof person>;

async function saveRegister(electionId: string, rows: VoterRecord[]): Promise<RegisterState> {
  if (process.env.ENABLE_VOTER_REGISTER !== "true")
    return { error: "Voter register editing is disabled.", success: "" };
  const staff = await readStaffSession();
  if (staff?.role !== "ELECTORAL_ADMIN" || !staff.electoralBodyId)
    return { error: "Not authorized.", success: "" };
  if (rows.length === 0 || rows.length > 100)
    return { error: "Submit between 1 and 100 voters per batch.", success: "" };
  if (new Set(rows.map(r => r.email)).size !== rows.length)
    return { error: "The submitted file contains duplicate email addresses.", success: "" };

  try {
    await getDb().$transaction(async tx => {
      const [account, election] = await Promise.all([
        tx.staffAccount.findUnique({ where: { id: staff.id },
          select: { role: true, isDisabled: true, electoralBodyId: true } }),
        tx.election.findFirst({ where: {
          id: electionId, electoralBodyId: staff.electoralBodyId!, status: "DRAFT"
        }, select: { id: true, electoralBody: {
          select: { status: true, paymentStatus: true, emailVerifiedAt: true }
        } } })
      ]);
      if (!account || account.isDisabled || account.role !== "ELECTORAL_ADMIN" ||
          account.electoralBodyId !== staff.electoralBodyId || !election ||
          election.electoralBody.status !== "APPROVED" ||
          election.electoralBody.paymentStatus !== "PAID" ||
          !election.electoralBody.emailVerifiedAt) throw new Error("register-not-permitted");
      const current = await tx.voter.count({ where: { electionId } });
      if (current + rows.length > 1000) throw new Error("register-capacity");
      await tx.voter.createMany({
        data: rows.map(row => ({
          electoralBodyId: staff.electoralBodyId!,
          electionId,
          fullName: row.name, email: row.email,
          phone: row.phone || null,
          voterCode: randomBytes(24).toString("base64url"),
          isActive: true
        }))
      });
      await tx.authAuditEvent.create({ data: { accountId: staff.id, action: "VOTER_REGISTER_UPDATED" } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch {
    return { error: "Register update failed. Check approval, duplicate email addresses, draft status or the 1,000-voter pilot limit.", success: "" };
  }
  revalidatePath("/electoral/voters/" + electionId);
  revalidatePath("/electoral/voters");
  return { error: "", success: rows.length === 1 ? "Voter added to draft register." : rows.length + " voters added to draft register." };
}

export async function addSingleVoterAction(
  _previous: RegisterState, form: FormData
): Promise<RegisterState> {
  const electionId = identifier.safeParse(form.get("electionId"));
  const voter = person.safeParse({
    name: form.get("name"), email: form.get("email"), phone: form.get("phone") ?? ""
  });
  if (!electionId.success || !voter.success)
    return { error: "Provide a valid full name, email and optional phone.", success: "" };
  return saveRegister(electionId.data, [voter.data]);
}

export async function importVoterCsvAction(
  _previous: RegisterState, form: FormData
): Promise<RegisterState> {
  const electionId = identifier.safeParse(form.get("electionId"));
  const uploaded = form.get("file");
  if (!electionId.success || !(uploaded instanceof File) ||
      uploaded.size === 0 || uploaded.size > 100_000 || !uploaded.name.toLowerCase().endsWith(".csv"))
    return { error: "Choose a valid CSV file under 100 KB.", success: "" };
  let rows: VoterRecord[];
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(await uploaded.arrayBuffer());
    const records = parse(text, {
      columns: true, bom: true, skip_empty_lines: true, trim: true,
      relax_column_count: false, max_record_size: 512
    }) as Record<string, string>[];
    if (records.length < 1 || records.length > 100) throw new Error("invalid row count");
    rows = records.map(record => {
      const keys = Object.keys(record);
      if (keys.length !== 3 || !["name", "email", "phone"].every(k => keys.includes(k)))
        throw new Error("unexpected columns");
      return person.parse(record);
    });
  } catch {
    return { error: "CSV must have headers name,email,phone with 1–100 valid, unique rows.", success: "" };
  }
  return saveRegister(electionId.data, rows);
}
