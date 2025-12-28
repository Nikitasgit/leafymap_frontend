import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./index";
import { PlaceCategory, UserCategory } from "@/types/categories";

export const fetchCategories = createAsyncThunk(
  "app/fetchCategories",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

type AppState = {
  userCategories: UserCategory[];
  placeCategories: PlaceCategory[];
  loading: boolean;
  error: string | null;
};

const initialState: AppState = {
  userCategories: [],
  placeCategories: [],
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.userCategories = action.payload.userCategories;
        state.placeCategories = action.payload.placeCategories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default appSlice.reducer;

export const selectUserCategories = (state: RootState) =>
  state.app.userCategories;
export const selectPlaceCategories = (state: RootState) =>
  state.app.placeCategories;
export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectAppError = (state: RootState) => state.app.error;
