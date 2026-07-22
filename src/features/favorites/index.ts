// Public API of the favorites feature — import from "@/features/favorites".
// Prefer deep imports for the Redux model from store/
// Example: `@/features/favorites/model/favoritesSlice`.

// API
export {
  getFavoritesByType,
  addFavorite as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
} from "./api/favoritesApi";

// Model (slice actions / selectors — needed by store & other features)
export {
  default as favoritesReducer,
  fetchFavoritesByType,
  addFavorite,
  removeFavorite,
  resetFavorites,
  selectFavorites,
  selectPlaceFavorites,
  selectIsPlaceFavorited,
} from "./model/favoritesSlice";
