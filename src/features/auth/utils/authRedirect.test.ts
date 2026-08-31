import { describe, expect, it } from "vitest";
import { getAuthenticatedRedirectPath } from "./authRedirect";

describe("getAuthenticatedRedirectPath", () => {
  it("sends users who have not accepted CGU to accept-cgu", () => {
    expect(
      getAuthenticatedRedirectPath({ acceptedCGU: false, role: "user" }),
    ).toBe("/auth/accept-cgu");
  });

  it("sends admins to the admin users page", () => {
    expect(
      getAuthenticatedRedirectPath({ acceptedCGU: true, role: "admin" }),
    ).toBe("/admin/users");
  });

  it("sends regular users to account", () => {
    expect(
      getAuthenticatedRedirectPath({ acceptedCGU: true, role: "user" }),
    ).toBe("/account");
  });

  it("falls back to account when user is missing", () => {
    expect(getAuthenticatedRedirectPath(null)).toBe("/account");
    expect(getAuthenticatedRedirectPath(undefined)).toBe("/account");
  });
});
