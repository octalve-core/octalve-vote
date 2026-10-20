import { expect, test } from "@playwright/test";
import { randomBytes } from "node:crypto";

test("continuous browser journey: two pending electoral bodies, logout and login", async ({ page }) => {
  // The database is initialized by CI before the browser recording begins.
  // This test never reads/writes the database directly or calls a backend API.
  // After opening the homepage, all navigation is via on-screen links/buttons.
  const identifier = randomBytes(6).toString("hex");
  const firstEmail = `electoral-a-${identifier}@example.test`;
  const secondEmail = `electoral-b-${identifier}@example.test`;
  const passphrase = `E2E-${randomBytes(24).toString("hex")}`;

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();
  const publicNavigation = page.getByRole("navigation", { name: "Primary navigation" });
  await publicNavigation.getByRole("link", { name: "About Us" }).click();
  await expect(page.getByRole("heading", { name: /about octalve vote/i })).toBeVisible();
  await publicNavigation.getByRole("link", { name: "Pricing" }).click();
  await expect(page.getByRole("heading", { name: /simple, transparent pricing/i })).toBeVisible();
  await publicNavigation.getByRole("link", { name: "Contact" }).click();
  await expect(page.getByRole("heading", { name: /contact channel being configured/i })).toBeVisible();
  await page.getByRole("link", { name: /return home/i }).click();

  await page.getByRole("link", { name: /voter entrance/i }).last().click();
  await expect(page.getByRole("heading", { name: /your vote, your voice/i })).toBeVisible();
  await page.getByRole("link", { name: /back to home/i }).click();

  await page.getByRole("link", { name: "Electoral body portal" }).first().click();
  await expect(page.getByRole("heading", { name: /electoral body portal/i })).toBeVisible();
  await page.getByRole("tab", { name: "Register" }).click();

  async function register(organization: string, email: string) {
    await page.getByLabel("Organization name").fill(organization);
    await page.getByLabel("Contact person").fill("Synthetic Electoral Officer");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password (12+ characters)").fill(passphrase);
    await page.getByLabel("Confirm password").fill(passphrase);
    await page.getByLabel("Subscription category (not a payment)").selectOption("ORGANIZATIONAL");
    await page.getByRole("button", { name: "Create pending organization account" }).click();
    await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Organization approval pending" })).toBeVisible();
    await expect(page.getByText("No Elections Yet")).toBeVisible();
    await expect(page.getByRole("link", { name: organization })).toBeVisible();
  }

  const firstName = "CI Electoral Group A " + identifier;
  const secondName = "CI Electoral Group B " + identifier;
  await register(firstName, firstEmail);
  await page.waitForTimeout(1000);

  const navigation = page.getByRole("navigation", { name: "Electoral dashboard navigation" });
  await navigation.getByRole("link", { name: "Elections" }).click();
  await expect(page.getByRole("heading", { name: "Elections", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create draft election" })).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Draft creation is not available");
  await navigation.getByRole("link", { name: "Voters" }).click();
  await expect(page.getByRole("heading", { name: "Voters", exact: true })).toBeVisible();
  await navigation.getByRole("link", { name: "Support" }).click();
  await expect(page.getByRole("heading", { name: "Support", exact: true })).toBeVisible();
  await navigation.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByRole("heading", { name: /electoral body portal/i })).toBeVisible();
  await page.getByRole("tab", { name: "Register" }).click();
  await register(secondName, secondEmail);
  await expect(page.getByText(firstName)).toHaveCount(0);

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByRole("heading", { name: /electoral body portal/i })).toBeVisible();
  await page.getByLabel("Email address").fill(firstEmail);
  await page.getByLabel("Password", { exact: true }).fill("invalid-" + passphrase);
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await expect(page.locator("p[role=\"alert\"]")).toContainText("Invalid credentials");
  await expect(page.getByLabel("Email address")).toHaveValue(firstEmail);
  await page.getByLabel("Password", { exact: true }).fill(passphrase);
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: firstName })).toBeVisible();
  await expect(page.getByText(secondName)).toHaveCount(0);

  await page.getByRole("button", { name: "Logout" }).click();

  // Approved test identity is created by the ephemeral CI setup before this
  // recording, not through an API or database access by this browser journey.
  const approvedEmail = process.env.CI_APPROVED_ELECTORAL_EMAIL;
  const approvedPassword = process.env.CI_APPROVED_ELECTORAL_PASSWORD;
  if (!approvedEmail || !approvedPassword) throw new Error("Missing ephemeral approved test identity");

  await page.getByLabel("Email address").fill(approvedEmail);
  await page.getByLabel("Password", { exact: true }).fill(approvedPassword);
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Octalve CI Approved Organization" })).toBeVisible();
  const approvedNav = page.getByRole("navigation", { name: "Electoral dashboard navigation" });
  await approvedNav.getByRole("link", { name: "Elections" }).click();
  await expect(page.getByRole("heading", { name: "Elections", exact: true })).toBeVisible();
  await expect(page.getByText("Other Organization Confidential Test Draft")).toHaveCount(0);
  await page.getByRole("link", { name: "Create draft election" }).click();
  await expect(page.getByRole("heading", { name: "Create an election" })).toBeVisible();

  const draftTitle = "CI Approved Draft " + identifier;
  await page.getByLabel("Election title").fill(draftTitle);
  await page.getByLabel("Description (optional)").fill("Synthetic test draft, not a real election.");
  await page.getByRole("button", { name: "Create draft election" }).click();
  await expect(page.getByRole("heading", { name: "Elections", exact: true })).toBeVisible();
  await page.getByRole("link", { name: draftTitle }).click();
  await expect(page.getByRole("heading", { name: draftTitle })).toBeVisible();
  await expect(page.getByText("Synthetic test draft, not a real election.")).toBeVisible();
  await page.getByRole("link", { name: "Back to elections" }).click();
  await expect(page.getByRole("heading", { name: "Elections", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Logout" }).click();

  await publicNavigation.getByRole("link", { name: "Home" }).click();
  await page.getByRole("link", { name: "Platform admin", exact: true }).click();
  await expect(page.getByRole("heading", { name: /platform administrator/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in securely/i })).toBeDisabled();
  await publicNavigation.getByRole("link", { name: "Home" }).click();
  await expect(page.getByRole("heading", { name: /modern voting made simple/i })).toBeVisible();
});
