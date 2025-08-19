import { useSelector } from "react-redux";
import {
  selectCreatorCategories,
  selectPlaceCategories,
  selectAppLoading,
  selectAppError,
} from "@/store/appSlice";
import { PlaceCategory, SubCategory } from "@/types/categories";

export interface AppState {
  creatorCategories: SubCategory[];
  placeCategories: PlaceCategory[];
  loading: boolean;
  error: string | null;
}

export const useApp = (): AppState => {
  const creatorCategories = useSelector(selectCreatorCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const loading = useSelector(selectAppLoading);
  const error = useSelector(selectAppError);

  return {
    creatorCategories,
    placeCategories,
    loading,
    error,
  };
};
