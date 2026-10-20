import { test, expect } from "@playwright/test";

test("single browser-only walkthrough of public and protected-role entry flows", async ({ page }) => {
  // One recording. Start at homepage; navigate thereafter only through visible UI controls.
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();

  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await nav.getByRole("link", { name: "About Us" }).click();
  await expect(page.getByRole("heading", { name: /about octalve vote/i })).toBeVisible();

  await nav.getByRole("link", { name: "Pricing" }).click();
  await expect(page.getByRole("heading", { name: /simple, transparent pricing/i })).toBeVisible();

  await nav.getByRole("link", { name: "Contact" }).click();
  await expect(page.getByRole("heading", { name: /contact channel being configured/i })).toBeVisible();

  await page.getByRole("link", { name: /return home/i }).click();
  await page.getByRole("link", { name: /voter entrance/i }).last().click();
  await expect(page.getByRole("heading", { name: /your vote, your voice/i })).toBeVisible();
  await expect(page.getByText(/sign-in, otp delivery.*intentionally unavailable/i)).toBeVisible();

  await page.getByRole("link", { name: /back to home/i }).click();
  await page.getByRole("link", { name: /electoral body portal/i }).first().click();
  await expect(page.getByRole("heading", { name: /electoral body portal/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in securely/i })).toBeDisabled();
  await page.getByRole("tab", { name: "Register" }).click();
  await expect(page.getByRole("button", { name: /create pending organization account/i })).toBeDisabled();
  await page.getByRole("tab", { name: "Sign in" }).click();

  await nav.getByRole("link", { name: "Home" }).click();
  await page.getByRole("link", { name: "Platform admin", exact: true }).click();
  await expect(page.getByRole("heading", { name: /platform administrator/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in securely/i })).toBeDisabled();

  await nav.getByRole("link", { name: "Home" }).click();
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();
});
