import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectCategoryTypes,
  selectUserCategories,
  selectPlaceCategories,
  selectProductCategories,
  selectEventCategories,
} from "@/store/appSlice";
import { fetchCurrentUser, selectAuth } from "@/store/authSlice";
import {
  fetchUserNotifications,
  selectNotifications,
} from "@/store/notificationSlice";
import {
  fetchFavoritesByType,
  selectFavorites,
} from "@/store/favoritesSlice";
import type { AppDispatch } from "@/store";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const categoryTypes = useSelector(selectCategoryTypes);
  const userCategories = useSelector(selectUserCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const productCategories = useSelector(selectProductCategories);
  const eventCategories = useSelector(selectEventCategories);
  const { lastFetched } = useSelector(selectNotifications);
  const { lastFetchedByType } = useSelector(selectFavorites);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (
      !categoryTypes?.length ||
      !userCategories?.length ||
      !placeCategories?.length ||
      !productCategories?.length ||
      !eventCategories?.length
    ) {
      dispatch(fetchCategories());
    }
  }, [
    dispatch,
    categoryTypes,
    userCategories,
    placeCategories,
    productCategories,
    eventCategories,
  ]);

  useEffect(() => {
    if (user && !lastFetched) {
      dispatch(fetchUserNotifications());
    }
  }, [dispatch, user, lastFetched]);

  useEffect(() => {
    if (user && !lastFetchedByType.places) {
      dispatch(fetchFavoritesByType("Place"));
    }
  }, [dispatch, user, lastFetchedByType.places]);

  return null;
}
