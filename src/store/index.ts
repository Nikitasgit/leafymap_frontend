import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "@/features/categories/model/categoriesSlice";
import authReducer from "@/features/auth/model/authSlice";
import notificationReducer from "@/features/notifications/model/notificationSlice";
import favoritesReducer from "@/features/favorites/model/favoritesSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    auth: authReducer,
    notifications: notificationReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
