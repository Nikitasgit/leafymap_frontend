import { APP_URL } from "@/shared/config/app";
import { request } from "@/shared/api/client";
import type { Place } from "../types/place";

export const getPlacesByIds = async (ids: string[]): Promise<Place[]> => {
  if (ids.length === 0) return [];
  const data = await request<Place[]>({
    method: "GET",
    url: `/api/places/in-view`,
    params: { ids: ids.join(",") },
    headers: {
      Origin: APP_URL,
    },
  });
  return Array.isArray(data) ? data : [];
};

export const fetchPlaceById = async (
  placeId: string,
  options?: { scheduleWithEvents?: boolean },
): Promise<Place> => {
  return request<Place>({
    method: "GET",
    url: `/api/places/${placeId}`,
    params: options?.scheduleWithEvents
      ? { scheduleWithEvents: "true" }
      : undefined,
  });
};

export const fetchPlacesInView = async (
  params: Record<string, string | number | boolean | null | undefined>,
): Promise<Place[]> => {
  const data = await request<Place[]>({
    method: "GET",
    url: `/api/places/in-view`,
    params,
  });
  return Array.isArray(data) ? data : [];
};

export const createPlace = async (payload: unknown): Promise<Place> => {
  return request<Place>({
    method: "POST",
    url: `/api/places`,
    data: payload,
  });
};

export const updatePlace = async (
  placeId: string,
  payload: unknown,
): Promise<Place> => {
  return request<Place>({
    method: "PUT",
    url: `/api/places/${placeId}`,
    data: payload,
  });
};

export const deletePlace = async (placeId: string): Promise<void> => {
  await request<void>({ method: "DELETE", url: `/api/places/${placeId}` });
};
