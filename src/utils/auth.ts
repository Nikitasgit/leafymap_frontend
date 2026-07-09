import { User } from "@/types/user";

export const getAuthenticatedRedirectPath = (
  user: Pick<User, "acceptedCGU" | "role"> | null | undefined,
) => {
  if (user?.acceptedCGU === false) {
    return "/auth/accept-cgu";
  }

  return user?.role === "admin" ? "/admin/users" : "/account";
};
