import { combineReducers, configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "@/features/categories/model/categoriesSlice";
import authReducer from "@/features/auth/model/authSlice";
import notificationReducer from "@/features/notifications/model/notificationSlice";
import favoritesReducer from "@/features/favorites/model/favoritesSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const rootReducer = combineReducers({
  categories: categoriesReducer,
  auth: authReducer,
  notifications: notificationReducer,
  favorites: favoritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export const store = createAppStore();
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof createAppStore>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
