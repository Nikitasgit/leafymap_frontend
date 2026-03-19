export type MapFilters = {
  placeTypes: string[];
  placeCategories: string[];
  minRating?: number | null;
  userCategoryIds?: string[];
  productCategoryIds?: string[];
  startDate?: Date | null;
  endDate?: Date | null;
};
