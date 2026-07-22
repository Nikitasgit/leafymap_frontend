import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { signOut } from "@/features/auth/model/authSlice";
import {
  getFavoritesByType,
  addFavorite as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
} from "../api/favoritesApi";

export const fetchFavoritesByType = createAsyncThunk(
  "favorites/fetchFavoritesByType",
  async (referenceType: string) => {
    const data = await getFavoritesByType(referenceType);
    return { referenceType, ids: data?.ids ?? [] };
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (
    { referenceId, referenceType }: { referenceId: string; referenceType: string },
    { dispatch }
  ) => {
    await addFavoriteApi(referenceId, referenceType);
    await dispatch(fetchFavoritesByType(referenceType));
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (
    { referenceId, referenceType }: { referenceId: string; referenceType: string },
    { dispatch }
  ) => {
    await removeFavoriteApi(referenceId, referenceType);
    await dispatch(fetchFavoritesByType(referenceType));
  }
);

type FavoritesState = {
  places: string[];
  loading: boolean;
  error: string | null;
  lastFetchedByType: { places?: number };
};

const initialState: FavoritesState = {
  places: [],
  loading: false,
  error: null,
  lastFetchedByType: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    resetFavorites: (state) => {
      state.places = [];
      state.error = null;
      state.lastFetchedByType = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFavoritesByType
      .addCase(fetchFavoritesByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoritesByType.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.referenceType === "Place") {
          state.places = action.payload.ids;
          state.lastFetchedByType.places = Date.now();
        }
      })
      .addCase(fetchFavoritesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch favorites";
      })
      // addFavorite
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add favorite";
      })
      // removeFavorite
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove favorite";
      })
      // signOut
      .addCase(signOut.fulfilled, (state) => {
        state.places = [];
        state.error = null;
        state.lastFetchedByType = {};
      });
  },
});

export default favoritesSlice.reducer;

export const { resetFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: RootState) => state.favorites;

export const selectPlaceFavorites = (state: RootState): string[] =>
  state.favorites.places;

export const selectIsPlaceFavorited = (placeId: string | undefined) => (
  state: RootState
): boolean => {
  if (!placeId) return false;
  return state.favorites.places.includes(placeId);
};
