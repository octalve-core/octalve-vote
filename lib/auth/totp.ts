import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// Private application utility shared with CI fixture setup. Never import into client code.
function key(): Buffer {
  const raw = process.env.MFA_ENCRYPTION_KEY || "";
  if (!/^[a-f0-9]{64}$/i.test(raw)) throw new Error("MFA encryption key not configured");
  return Buffer.from(raw, "hex");
}

export function encryptMfaSecret(secret: string): string {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), nonce);
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return Buffer.concat([nonce, cipher.getAuthTag(), ciphertext]).toString("base64");
}
export function decryptMfaSecret(value: string): string {
  const parts = Buffer.from(value, "base64");
  if (parts.length < 29) throw new Error("Invalid encrypted MFA secret");
  const decipher = createDecipheriv("aes-256-gcm", key(), parts.subarray(0, 12));
  decipher.setAuthTag(parts.subarray(12, 28));
  return Buffer.concat([decipher.update(parts.subarray(28)), decipher.final()]).toString("utf8");
}

// RFC 6238, HMAC-SHA1, 6 digits, 30s. Secrets are base32 (authenticator-app compatible).
export function base32Bytes(secret: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0, value = 0;
  const bytes: number[] = [];
  for (const char of secret.replace(/=+$/, "").toUpperCase()) {
    const index = alphabet.indexOf(char);
    if (index < 0) throw new Error("Invalid base32 MFA secret");
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  if (bytes.length < 20) throw new Error("MFA secret too short");
  return Buffer.from(bytes);
}

export function totpCode(secret: string, counter: number): string {
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", base32Bytes(secret)).update(message).digest();
  const offset = digest[digest.length - 1] & 15;
  const value = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return String(value).padStart(6, "0");
}

export function verifyTotpCounter(secret: string, code: string, lastCounter: bigint | null): bigint | null {
  if (!/^\d{6}$/.test(code)) return null;
  const now = Math.floor(Date.now() / 30_000);
  const supplied = Buffer.from(code, "utf8");
  for (const counter of [now - 1, now, now + 1]) {
    if (lastCounter !== null && BigInt(counter) <= lastCounter) continue;
    const expected = Buffer.from(totpCode(secret, counter), "utf8");
    if (timingSafeEqual(expected, supplied)) return BigInt(counter);
  }
  return null;
}
