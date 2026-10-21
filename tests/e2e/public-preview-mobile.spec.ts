import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test("mobile browser-only walkthrough: public pages and unified role-based access", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  await mobileNav.getByRole("link", { name: "About Us" }).click();
  await expect(page.getByRole("heading", { name: /about octalve vote/i })).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await mobileNav.getByRole("link", { name: "Pricing" }).click();
  await expect(page.getByRole("heading", { name: /simple, transparent pricing/i })).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await mobileNav.getByRole("link", { name: "Contact" }).click();
  await expect(page.getByRole("heading", { name: /contact channel being configured/i })).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await mobileNav.getByRole("link", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: /welcome to octalve vote/i })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Electoral Body Portal" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in securely" })).toBeDisabled();
  await page.getByRole("tab", { name: "Register" }).click();
  await expect(page.getByRole("button", { name: "Create pending organization account" })).toBeDisabled();
  await page.getByRole("button", { name: "Change your role" }).click();
  const roleNav = page.getByRole("navigation", { name: "Choose account role" });
  await roleNav.getByRole("link", { name: /I'm a voter/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Your vote, your voice." })).toBeVisible();
  await expect(page.getByText(/ballot submission are intentionally unavailable/i)).toBeVisible();
  await page.getByRole("button", { name: "Change your role" }).click();
  await roleNav.getByRole("link", { name: /I'm a platform admin/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Platform Administrator" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in securely" })).toBeDisabled();
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();
});
