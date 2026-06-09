import { UserType } from "@/types/user";

export const getHeaderRoute = (userType: UserType | undefined) => {
  switch (userType) {
    case "guest":
      return "/account/create";
    case "creator":
      return "/account?sidebar=events&tab=my-events";
    default:
      return "/auth/register";
  }
};

export type HeaderCtaKey = "guest" | "creator" | "loggedOut";

export const getHeaderCtaKey = (
  userType: UserType | undefined
): HeaderCtaKey => {
  switch (userType) {
    case "guest":
      return "guest";
    case "creator":
      return "creator";
    default:
      return "loggedOut";
  }
};
