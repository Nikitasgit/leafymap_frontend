import { useSelector } from "react-redux";
import {
  selectCategoryTypes,
  selectUserCategories,
  selectPlaceCategories,
  selectProductCategories,
  selectEventCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../model/categoriesSlice";
import type {
  CategoryType,
  EventCategory,
  PlaceCategory,
  UserCategory,
} from "@/shared/types/categories";
import type { ProductCategory } from "@/features/products/types";

export interface CategoriesState {
  categoryTypes: CategoryType[];
  userCategories: UserCategory[];
  placeCategories: PlaceCategory[];
  productCategories: ProductCategory[];
  eventCategories: EventCategory[];
  loading: boolean;
  error: string | null;
}

/** @deprecated Use CategoriesState */
export type AppState = CategoriesState;

export const useCategories = (): CategoriesState => {
  const categoryTypes = useSelector(selectCategoryTypes);
  const userCategories = useSelector(selectUserCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const productCategories = useSelector(selectProductCategories);
  const eventCategories = useSelector(selectEventCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  return {
    categoryTypes,
    userCategories,
    placeCategories,
    productCategories,
    eventCategories,
    loading,
    error,
  };
};

/** @deprecated Use useCategories */
export const useApp = useCategories;
