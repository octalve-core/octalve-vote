import "server-only";

export const SESSION_COOKIE = "octalve_vote_staff";
export const SESSION_DAYS = 7;

export function isStaffLoginEnabled(): boolean {
  return process.env.ENABLE_STAFF_LOGIN === "true" && Boolean(process.env.DATABASE_URL);
}

export function isSignupEnabled(): boolean {
  return isStaffLoginEnabled() && process.env.ENABLE_ELECTORAL_SIGNUP === "true";
}

// Admin access and approvals remain OFF unless MFA is provisioned and enabled.
export function isAdminMfaEnabled(): boolean {
  return isStaffLoginEnabled() && process.env.ENABLE_ADMIN_MFA === "true" &&
    /^[a-f0-9]{64}$/i.test(process.env.MFA_ENCRYPTION_KEY ?? "");
}
export function areApprovalsEnabled(): boolean {
  return isAdminMfaEnabled() && process.env.ENABLE_ORGANIZATION_APPROVALS === "true";
}
