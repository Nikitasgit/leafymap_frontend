import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectCreatorCategories,
  selectPlaceCategories,
} from "@/store/appSlice";
import { fetchCurrentUser, selectAuth } from "@/store/authSlice";
import type { AppDispatch } from "@/store";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const creatorCategories = useSelector(selectCreatorCategories);
  const placeCategories = useSelector(selectPlaceCategories);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!creatorCategories?.length || !placeCategories?.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, creatorCategories, placeCategories]);

  return null;
}
