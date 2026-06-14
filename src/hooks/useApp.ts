import { useSelector } from "react-redux";
import {
  selectCategoryTypes,
  selectUserCategories,
  selectPlaceCategories,
  selectProductCategories,
  selectEventCategories,
  selectAppLoading,
  selectAppError,
} from "@/store/appSlice";
import {
  CategoryType,
  EventCategory,
  PlaceCategory,
  UserCategory,
} from "@/types/categories";
import { ProductCategory } from "@/types/product";

export interface AppState {
  categoryTypes: CategoryType[];
  userCategories: UserCategory[];
  placeCategories: PlaceCategory[];
  productCategories: ProductCategory[];
  eventCategories: EventCategory[];
  loading: boolean;
  error: string | null;
}

export const useApp = (): AppState => {
  const categoryTypes = useSelector(selectCategoryTypes);
  const userCategories = useSelector(selectUserCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const productCategories = useSelector(selectProductCategories);
  const eventCategories = useSelector(selectEventCategories);
  const loading = useSelector(selectAppLoading);
  const error = useSelector(selectAppError);

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
