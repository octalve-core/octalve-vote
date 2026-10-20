import { test, expect } from "@playwright/test";

test("single continuous public and role-entry browser walkthrough", async ({ page }) => {
  // Start at home; every subsequent page is reached by clicking its visible link.
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();

  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await navigation.getByRole("link", { name: "About Us" }).click();
  await expect(page.getByRole("heading", { name: /about octalve vote/i })).toBeVisible();

  await navigation.getByRole("link", { name: "Pricing" }).click();
  await expect(page.getByRole("heading", { name: /simple, transparent pricing/i })).toBeVisible();

  await navigation.getByRole("link", { name: "Contact" }).click();
  await expect(page.getByRole("heading", { name: /contact channel being configured/i })).toBeVisible();

  await page.getByRole("link", { name: /return home/i }).click();
  await page.getByRole("link", { name: /voter entrance/i }).last().click();
  await expect(page.getByRole("heading", { name: /your vote, your voice/i })).toBeVisible();
  await expect(page.getByText(/sign-in, otp delivery.*intentionally unavailable/i)).toBeVisible();

  await page.getByRole("link", { name: /back to home/i }).click();
  await page.getByRole("link", { name: /electoral body portal/i }).click();
  await expect(page.getByRole("heading", { name: /manage elections with clarity/i })).toBeVisible();
  await expect(page.getByText(/review-only access/i)).toBeVisible();

  await page.getByRole("link", { name: /back to home/i }).click();
  await page.getByRole("link", { name: /platform admin/i }).click();
  await expect(page.getByRole("heading", { name: /oversight with boundaries/i })).toBeVisible();
  await expect(page.getByText(/review-only access/i)).toBeVisible();

  await page.getByRole("link", { name: /back to home/i }).click();
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();
});
