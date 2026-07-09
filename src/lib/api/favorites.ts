import { apiClient } from "@/lib/api/client";

const baseUrl = `/api/favorites`;

export const getFavoritesByType = async (
  referenceType: string
): Promise<{ ids: string[] }> => {
  const response = await apiClient.get(baseUrl, {
    params: { referenceType }
  });
  return response.data.data;
};

export const addFavorite = async (
  referenceId: string,
  referenceType: string
): Promise<void> => {
  await apiClient.post(
    baseUrl,
    { referenceId, referenceType },
    {
      headers: { "Content-Type": "application/json" }
    }
  );
};

export const removeFavorite = async (
  referenceId: string,
  referenceType: string
): Promise<void> => {
  await apiClient.delete(baseUrl, {
    data: { referenceId, referenceType }
  });
};
