import { APP_URL } from "@/shared/config/app";
import { request } from "@/shared/api/client";
import type { User, UserPopulated } from "../types";
import type { PlacePopulated } from "@/features/places/types/place";

export type UserProfile = {
  user: UserPopulated;
  place: PlacePopulated | null;
};

export const getUserById = async (userId: string) => {
  try {
    const data = await request<{ user: UserPopulated }>({
      method: "GET",
      url: `/api/users/${userId}`,
      headers: {
        Origin: APP_URL,
      },
    });
    return data.user;
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erreur lors du chargement de l'utilisateur";
    return errorMessage;
  }
};

export const fetchUserById = async (
  userId: string,
): Promise<UserPopulated> => {
  const data = await request<{ user: UserPopulated }>({
    method: "GET",
    url: `/api/users/${userId}`,
  });
  return data.user;
};

export const searchUsers = async (
  queryParams: Record<string, string | string[]>,
  limit: number = 5,
): Promise<UserPopulated[]> => {
  const searchParams = new URLSearchParams();
  Object.entries(queryParams || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.append(key, value);
    }
  });
  searchParams.append("limit", limit.toString());

  return request<UserPopulated[]>({
    method: "GET",
    url: `/api/users/?${searchParams.toString()}`,
  });
};

export const updateUser = async (data: Partial<User>): Promise<void> => {
  await request<void>({ method: "PUT", url: "/api/users", data });
};

export const fetchUserProfile = async (
  userId: string,
): Promise<UserProfile> => {
  return request<UserProfile>({
    method: "GET",
    url: `/api/users/${userId}/profile`,
  });
};
