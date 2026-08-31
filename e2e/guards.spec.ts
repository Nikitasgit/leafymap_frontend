import { expect, test } from "@playwright/test";

test.describe("Route guards", () => {
  test("unauthenticated /account redirects to signin", async ({ page }) => {
    await page.goto("/account");

    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(
      page.getByRole("heading", { name: "Se connecter" }),
    ).toBeVisible();
  });
});
