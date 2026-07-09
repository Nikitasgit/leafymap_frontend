import { APP_URL } from "@/utils/constants";
import { apiClient } from "@/lib/api/client";

export const getUserById = async (userId: string) => {
  try {
    const url = `/api/users/${userId}`;
    const response = await apiClient.get(url, {
      headers: {
        Origin: APP_URL,
        "Content-Type": "application/json",
      },
    });

    return response.data.data.user;
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erreur lors du chargement de l'utilisateur";
    return errorMessage;
  }
};
