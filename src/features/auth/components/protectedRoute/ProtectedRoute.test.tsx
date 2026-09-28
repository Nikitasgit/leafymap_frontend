/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { mockRouter } from "@/test/setup";
import { makeAuthState, makeUser } from "@/test/user";
import ProtectedRoute from "./ProtectedRoute";

const content = "Contenu protégé";

const renderProtected = (
  auth: ReturnType<typeof makeAuthState>,
  props: Partial<Parameters<typeof ProtectedRoute>[0]> = {}
) =>
  renderWithProviders(
    <ProtectedRoute fallback={<div>Chargement</div>} {...props}>
      <div>{content}</div>
    </ProtectedRoute>,
    { preloadedState: { auth } }
  );

describe("ProtectedRoute", () => {
  it("shows the fallback while loading and does not redirect", () => {
    const { queryByText } = renderProtected(makeAuthState({ loading: true }));

    expect(queryByText("Chargement")).toBeInTheDocument();
    expect(queryByText(content)).not.toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("redirects guests to signin", () => {
    const { queryByText } = renderProtected(makeAuthState());

    expect(queryByText(content)).not.toBeInTheDocument();
    expect(mockRouter.push).toHaveBeenCalledWith("/auth/signin");
  });

  it("redirects users who have not accepted CGU", () => {
    const { queryByText } = renderProtected(
      makeAuthState({ user: makeUser() })
    );

    expect(queryByText(content)).not.toBeInTheDocument();
    expect(mockRouter.push).toHaveBeenCalledWith("/auth/accept-cgu");
  });

  it("renders children for an authenticated user who accepted CGU", () => {
    const { getByText } = renderProtected(
      makeAuthState({
        user: makeUser({ acceptedAt: "2026-01-01T00:00:00.000Z" }),
      })
    );

    expect(getByText(content)).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("redirects a regular user away from an admin-only route", () => {
    const { queryByText } = renderProtected(
      makeAuthState({
        user: makeUser({
          acceptedAt: "2026-01-01T00:00:00.000Z",
          role: "user",
        }),
      }),
      { allowedRoles: ["admin"] }
    );

    expect(queryByText(content)).not.toBeInTheDocument();
    expect(mockRouter.push).toHaveBeenCalledWith("/auth/signin");
  });
});
