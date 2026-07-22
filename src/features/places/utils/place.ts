import { Place } from "../types/place";
import { PlaceCategory } from "@/shared/types/categories";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

/**
 * Extracts the name from a placeCategory field regardless of whether
 * it is already populated (object) or just a string id.
 */
export const getPlaceCategoryName = (
  cat: string | (PlaceCategory & { id: string }) | null | undefined,
): string => {
  const category = resolveRefObject(cat);
  if (category) return category.name ?? "";
  return typeof cat === "string" ? cat : "";
};

/**
 * Returns the display name for a place:
 * - If the place has a populated `user`, returns the username.
 * - Otherwise returns the place `name` field.
 */
export const getPlaceDisplayName = (place: Place): string => {
  const user = resolveRefObject(place.user);
  if (user && "username" in user) {
    return user.username ?? "";
  }
  return place.name ?? "";
};
