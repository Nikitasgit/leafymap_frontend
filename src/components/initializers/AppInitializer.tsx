import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectCategories,
  selectPlaceCategories,
  selectSubCategories,
} from "@/store/appSlice";
import { fetchCurrentUser, selectAuth } from "@/store/authSlice";
import type { AppDispatch } from "@/store";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const categories = useSelector(selectCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const subCategories = useSelector(selectSubCategories);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (
      !categories?.length ||
      !placeCategories?.length ||
      !subCategories?.length
    ) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories, placeCategories, subCategories]);

  return null;
}
