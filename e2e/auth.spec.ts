import { expect, test } from "@playwright/test";
import { e2eUser } from "./helpers/credentials";

test.describe("Email auth", () => {
  test("login then logout", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.getByLabel("Nom d'utilisateur ou Email").fill(e2eUser.email);
    await page.getByLabel("Mot de passe").fill(e2eUser.password);
    await page.getByRole("button", { name: "Se connecter", exact: true }).click();

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId("account-layout")).toBeVisible();

    await page.getByRole("button", { name: "Se déconnecter" }).click();

    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(
      page.getByRole("heading", { name: "Se connecter" }),
    ).toBeVisible();
  });

  test("wrong password stays on signin", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.getByLabel("Nom d'utilisateur ou Email").fill(e2eUser.email);
    await page.getByLabel("Mot de passe").fill("wrong");
    await page.getByRole("button", { name: "Se connecter", exact: true }).click();

    await expect(
      page.getByRole("button", { name: "Se connecter", exact: true }),
    ).toBeEnabled();
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.getByTestId("account-layout")).toHaveCount(0);
  });
});
