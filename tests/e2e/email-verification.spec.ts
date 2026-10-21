import { expect, test } from "@playwright/test";
import { randomBytes } from "node:crypto";

test("single browser-only email verification through the isolated SMTP inbox", async ({ page }) => {
  const suffix = randomBytes(6).toString("hex");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();
  await page.getByRole("link", { name: "Electoral body portal" }).first().click();
  await page.getByRole("tab", { name: "Register" }).click();
  await page.getByLabel("Organization name").fill("Email Verification Test Org " + suffix);
  await page.getByLabel("Contact person").fill("Synthetic Email Officer");
  await page.getByLabel("Email address").fill("verification-" + suffix + "@example.test");
  await page.getByLabel("Password (12+ characters)").fill("Email-Test-Strong-2026-" + suffix);
  await page.getByLabel("Confirm password").fill("Email-Test-Strong-2026-" + suffix);
  await page.getByRole("button", { name: "Create pending organization account" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  const nav = page.getByRole("navigation", { name: "Electoral dashboard navigation" });
  await nav.getByRole("link", { name: "Email", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Email verification" })).toBeVisible();
  await page.getByRole("button", { name: "Send verification email" }).click();
  await expect(page.getByRole("status")).toContainText("Verification email sent");

  const [inbox] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "Open isolated test inbox" }).click()
  ]);
  await inbox.waitForLoadState();
  const subject = inbox.getByText("Verify your Octalve Vote organization email").first();
  await expect(subject).toBeVisible({ timeout: 15000 });
  await subject.click();

  const htmlLink = inbox.frameLocator("iframe").getByRole("link", { name: "Verify organization email" });
  await expect(htmlLink).toBeVisible();
  const [verificationPage] = await Promise.all([
    inbox.waitForEvent("popup"),
    htmlLink.click()
  ]);
  await expect(verificationPage.getByRole("heading", { name: "Confirm your organization email" })).toBeVisible();
  await verificationPage.getByRole("button", { name: "Verify organization email" }).click();
  await expect(verificationPage.getByRole("status")).toContainText("Organization email verified");

  await nav.getByRole("link", { name: "Dashboard" }).click();
  await nav.getByRole("link", { name: "Email", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Email verified" })).toBeVisible();
  await page.getByRole("button", { name: "Logout" }).click();
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Home" }).click();
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();
});
