import "server-only";

export const SESSION_COOKIE = "octalve_vote_staff";
export const SESSION_DAYS = 7;

export function isStaffLoginEnabled(): boolean {
  return process.env.ENABLE_STAFF_LOGIN === "true" && Boolean(process.env.DATABASE_URL);
}

export function isSignupEnabled(): boolean {
  return isStaffLoginEnabled() && process.env.ENABLE_ELECTORAL_SIGNUP === "true";
}
