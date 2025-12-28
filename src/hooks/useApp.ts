import { useSelector } from "react-redux";
import {
  selectUserCategories,
  selectPlaceCategories,
  selectAppLoading,
  selectAppError,
} from "@/store/appSlice";
import { PlaceCategory, UserCategory } from "@/types/categories";

export interface AppState {
  userCategories: UserCategory[];
  placeCategories: PlaceCategory[];
  loading: boolean;
  error: string | null;
}

export const useApp = (): AppState => {
  const userCategories = useSelector(selectUserCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const loading = useSelector(selectAppLoading);
  const error = useSelector(selectAppError);

  return {
    userCategories,
    placeCategories,
    loading,
    error,
  };
};
