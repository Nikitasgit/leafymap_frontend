import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`;

export const getFavoritesByType = async (
  referenceType: string
): Promise<{ ids: string[] }> => {
  const response = await axios.get(baseUrl, {
    params: { referenceType },
    withCredentials: true,
  });
  return response.data.data;
};

export const addFavorite = async (
  referenceId: string,
  referenceType: string
): Promise<void> => {
  await axios.post(
    baseUrl,
    { referenceId, referenceType },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
};

export const removeFavorite = async (
  referenceId: string,
  referenceType: string
): Promise<void> => {
  await axios.delete(baseUrl, {
    data: { referenceId, referenceType },
    withCredentials: true,
  });
};
