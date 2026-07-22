import { request } from "@/shared/api/client";

const baseUrl = `/api/favorites`;

export const getFavoritesByType = async (
  referenceType: string,
): Promise<{ ids: string[] }> => {
  return request<{ ids: string[] }>({
    method: "GET",
    url: baseUrl,
    params: { referenceType },
  });
};

export const addFavorite = async (
  referenceId: string,
  referenceType: string,
): Promise<void> => {
  await request<void>({
    method: "POST",
    url: baseUrl,
    data: { referenceId, referenceType },
  });
};

export const removeFavorite = async (
  referenceId: string,
  referenceType: string,
): Promise<void> => {
  await request<void>({
    method: "DELETE",
    url: baseUrl,
    data: { referenceId, referenceType },
  });
};
