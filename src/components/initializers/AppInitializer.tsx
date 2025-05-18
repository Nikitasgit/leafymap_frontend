import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectCategories,
  selectPlaceCategories,
  selectSubCategories,
} from "@/store/appSlice";
import type { AppDispatch } from "@/store";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const subCategories = useSelector(selectSubCategories);

  useEffect(() => {
    if (
      categories.length === 0 ||
      placeCategories.length === 0 ||
      subCategories.length === 0
    ) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories, placeCategories, subCategories]);

  return null;
}
