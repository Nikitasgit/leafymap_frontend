import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectUserCategories,
  selectPlaceCategories,
} from "@/store/appSlice";
import { fetchCurrentUser, selectAuth } from "@/store/authSlice";
import {
  fetchUserNotifications,
  selectNotifications,
} from "@/store/notificationSlice";
import type { AppDispatch } from "@/store";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const userCategories = useSelector(selectUserCategories);
  const placeCategories = useSelector(selectPlaceCategories);
  const { lastFetched } = useSelector(selectNotifications);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!userCategories?.length || !placeCategories?.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, userCategories, placeCategories]);

  useEffect(() => {
    if (user && !lastFetched) {
      dispatch(fetchUserNotifications());
    }
  }, [dispatch, user, lastFetched]);

  return null;
}
