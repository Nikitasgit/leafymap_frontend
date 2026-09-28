/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { mockRouter } from "@/test/setup";
import { makeAuthState, makeUser } from "@/test/user";
import GuestOnlyRoute from "./GuestOnlyRoute";

const content = "Page invité";

const renderGuestOnly = (auth: ReturnType<typeof makeAuthState>) =>
  renderWithProviders(
    <GuestOnlyRoute fallback={<div>Chargement</div>}>
      <div>{content}</div>
    </GuestOnlyRoute>,
    { preloadedState: { auth } }
  );

describe("GuestOnlyRoute", () => {
  it("renders children for a guest", () => {
    const { getByText } = renderGuestOnly(makeAuthState());

    expect(getByText(content)).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("redirects an authenticated user who accepted CGU to account", () => {
    const { queryByText } = renderGuestOnly(
      makeAuthState({
        user: makeUser({ acceptedAt: "2026-01-01T00:00:00.000Z" }),
      })
    );

    expect(queryByText(content)).not.toBeInTheDocument();
    expect(mockRouter.replace).toHaveBeenCalledWith("/account");
  });
});
