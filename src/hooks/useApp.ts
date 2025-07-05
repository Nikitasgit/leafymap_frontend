import { useSelector } from "react-redux";
import {
  selectSubCategories,
  selectCategories,
  selectPlaceCategories,
  selectAppLoading,
  selectAppError,
} from "@/store/appSlice";
import { Category, PlaceCategory, SubCategory } from "@/types/categories";

export interface AppState {
  subCategories: SubCategory[];
  categories: Category[];
  placeCategories: PlaceCategory[];
  loading: boolean;
  error: string | null;
}

export const useApp = (): AppState => {
  const subCategories = useSelector(selectSubCategories);
  const categoriesData = useSelector(selectCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const loading = useSelector(selectAppLoading);
  const error = useSelector(selectAppError);

  return {
    subCategories,
    categories: categoriesData,
    placeCategories,
    loading,
    error,
  };
};
