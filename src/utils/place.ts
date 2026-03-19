import { Place } from "@/types/place";
import { PlaceCategory } from "@/types/categories";
import { User } from "@/types/user";

/**
 * Extracts the name from a placeCategory field regardless of whether
 * it is already populated (object) or just a string id.
 */
export const getPlaceCategoryName = (
  cat: string | (PlaceCategory & { _id: string }) | null | undefined
): string => (typeof cat === "string" ? cat : (cat?.name ?? ""));

/**
 * Returns the display name for a place:
 * - If the place has a populated `user`, returns the username.
 * - Otherwise returns the place `name` field.
 */
export const getPlaceDisplayName = (place: Place): string => {
  const u = place.user;
  if (u && typeof u === "object" && "username" in u) {
    return (u as User).username ?? "";
  }
  return place.name ?? "";
};
