import { describe, expect, it } from "vitest";
import type { User } from "@/features/users/types";
import reducer, {
  cguAccepted,
  fetchCurrentUser,
  signIn,
  signOut,
  verifyTwoFactor,
} from "./authSlice";

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  email: "user@example.com",
  username: "leafy",
  userType: "guest",
  phone: "",
  website: "",
  description: "",
  ...overrides,
});

const credentials = { identifier: "user@example.com", password: "secret" };

const initialState = {
  user: null,
  loading: true,
  error: null,
  twoFactorChallengeToken: null,
};

describe("authSlice", () => {
  it("sets the user on signIn.fulfilled", () => {
    const user = makeUser();
    const next = reducer(
      initialState,
      signIn.fulfilled({ user }, "req-1", credentials)
    );

    expect(next.user).toEqual(user);
    expect(next.loading).toBe(false);
    expect(next.twoFactorChallengeToken).toBeNull();
  });

  it("stores a 2FA challenge without setting a user", () => {
    const next = reducer(
      initialState,
      signIn.fulfilled(
        { twoFactorRequired: true, challengeToken: "challenge-1" },
        "req-1",
        credentials
      )
    );

    expect(next.user).toBeNull();
    expect(next.twoFactorChallengeToken).toBe("challenge-1");
    expect(next.loading).toBe(false);
  });

  it("reads the error from payload.message on signIn.rejected", () => {
    const next = reducer(
      { ...initialState, loading: true },
      signIn.rejected(
        null,
        "req-1",
        credentials,
        { message: "Invalid credentials" },
        true
      )
    );

    expect(next.loading).toBe(false);
    expect(next.error).toBe("Invalid credentials");
  });

  it("sets acceptedAt and email preference on cguAccepted", () => {
    const user = makeUser();
    const next = reducer(
      { ...initialState, user, loading: false },
      cguAccepted({ emailNotifications: true })
    );

    expect(next.user?.acceptedAt).toEqual(expect.any(String));
    expect(next.user?.preferences?.emailNotifications).toBe(true);
  });

  it("clears the user and 2FA challenge on signOut.fulfilled", () => {
    const next = reducer(
      {
        user: makeUser(),
        loading: true,
        error: null,
        twoFactorChallengeToken: "challenge-1",
      },
      signOut.fulfilled(undefined, "req-1", undefined)
    );

    expect(next.user).toBeNull();
    expect(next.twoFactorChallengeToken).toBeNull();
    expect(next.loading).toBe(false);
  });

  it("records an error when fetchCurrentUser is rejected", () => {
    const next = reducer(
      initialState,
      fetchCurrentUser.rejected(new Error("Network down"), "req-1", undefined)
    );

    expect(next.loading).toBe(false);
    expect(next.error).toBe("Network down");
    expect(next.user).toBeNull();
  });

  it("sets the user and clears the challenge on verifyTwoFactor.fulfilled", () => {
    const user = makeUser();
    const next = reducer(
      {
        ...initialState,
        twoFactorChallengeToken: "challenge-1",
        loading: true,
      },
      verifyTwoFactor.fulfilled(user, "req-1", {
        challengeToken: "challenge-1",
        code: "123456",
      })
    );

    expect(next.user).toEqual(user);
    expect(next.twoFactorChallengeToken).toBeNull();
    expect(next.loading).toBe(false);
  });
});
