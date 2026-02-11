import { useSelector } from "react-redux";
import {
  selectUserCategories,
  selectPlaceCategories,
  selectProductCategories,
  selectAppLoading,
  selectAppError,
} from "@/store/appSlice";
import { PlaceCategory, UserCategory } from "@/types/categories";
import { ProductCategory } from "@/types/product";

export interface AppState {
  userCategories: UserCategory[];
  placeCategories: PlaceCategory[];
  productCategories: ProductCategory[];
  loading: boolean;
  error: string | null;
}

export const useApp = (): AppState => {
  const userCategories = useSelector(selectUserCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const productCategories = useSelector(selectProductCategories);
  const loading = useSelector(selectAppLoading);
  const error = useSelector(selectAppError);

  return {
    userCategories,
    placeCategories,
    productCategories,
    loading,
    error,
  };
};
