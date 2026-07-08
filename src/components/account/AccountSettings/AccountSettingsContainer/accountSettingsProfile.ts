import type { User, UserPopulated } from "@/types/user";

/** Clés éditables dans Paramètres → Informations (étendre ce tableau pour de nouveaux champs). */
export const ACCOUNT_SETTINGS_PROFILE_KEYS = [
  "firstname",
  "lastname",
] as const;

export type AccountSettingsProfile = Pick<
  User,
  (typeof ACCOUNT_SETTINGS_PROFILE_KEYS)[number]
> & {
  preferences: {
    emailNotifications: boolean;
  };
};

export function isAccountSettingsProfileKey(
  key: string,
): key is keyof AccountSettingsProfile {
  return (ACCOUNT_SETTINGS_PROFILE_KEYS as readonly string[]).includes(key);
}

export function accountSettingsProfileFromUser(
  u: UserPopulated,
): AccountSettingsProfile {
  return {
    firstname: u.firstname ?? "",
    lastname: u.lastname ?? "",
    preferences: {
      emailNotifications: u.preferences?.emailNotifications ?? false,
    },
  };
}
