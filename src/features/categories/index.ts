// Public API of the categories feature — import from "@/features/categories".

export {
  default as categoriesReducer,
  fetchCategories,
  selectCategoryTypes,
  selectUserCategories,
  selectPlaceCategories,
  selectProductCategories,
  selectEventCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectAppLoading,
  selectAppError,
} from "./model/categoriesSlice";

export { useCategories, useApp } from "./hooks/useCategories";
export type { CategoriesState, AppState } from "./hooks/useCategories";

export type {
  CategoryType,
  UserCategory,
  PlaceCategory,
  EventCategory,
} from "./types";
