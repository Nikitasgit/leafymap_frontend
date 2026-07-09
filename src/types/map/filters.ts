export type MapDisplayMode = "events" | "places";

export type MapFilters = {
  placeTypes: string[];
  placeCategories: string[];
  eventCategories: string[];
  minRating?: number | null;
  userCategoryIds?: string[];
  productCategoryIds?: string[];
  startDate?: string | null;
  endDate?: string | null;
};
