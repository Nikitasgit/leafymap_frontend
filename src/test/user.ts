import type { User } from "@/features/users/types";
import type { RootState } from "@/store";

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  email: "user@example.com",
  username: "leafy",
  userType: "guest",
  phone: "",
  website: "",
  description: "",
  ...overrides,
});

export const makeAuthState = (
  overrides: Partial<RootState["auth"]> = {}
): RootState["auth"] => ({
  user: null,
  loading: false,
  error: null,
  twoFactorChallengeToken: null,
  ...overrides,
});
