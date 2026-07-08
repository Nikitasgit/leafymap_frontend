import axios from "axios";
import { APP_URL } from "@/utils/constants";
import type { Place } from "@/types/place";

export const getPlacesByIds = async (ids: string[]): Promise<Place[]> => {
  if (ids.length === 0) return [];
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/places/in-view`,
    {
      params: { ids: ids.join(",") },
      headers: {
        Origin: APP_URL,
        "Content-Type": "application/json",
      },
    }
  );
  return Array.isArray(response.data?.data) ? response.data.data : [];
};
