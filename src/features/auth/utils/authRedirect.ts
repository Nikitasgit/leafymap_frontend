import type { User } from "@/features/users/types";

export const getAuthenticatedRedirectPath = (
  user: Pick<User, "acceptedAt" | "role"> | null | undefined,
) => {
  if (user && !user.acceptedAt) {
    return "/auth/accept-cgu";
  }

  return user?.role === "admin" ? "/admin/users" : "/account";
};
