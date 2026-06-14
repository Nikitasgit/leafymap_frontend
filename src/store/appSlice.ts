import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./index";
import {
  CategoryType,
  EventCategory,
  PlaceCategory,
  UserCategory,
} from "@/types/categories";
import { ProductCategory } from "@/types/product";

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
  categoryTypes: CategoryType[];
  userCategories: UserCategory[];
  placeCategories: PlaceCategory[];
  productCategories: ProductCategory[];
  eventCategories: EventCategory[];
  loading: boolean;
  error: string | null;
};

const initialState: AppState = {
  categoryTypes: [],
  userCategories: [],
  placeCategories: [],
  productCategories: [],
  eventCategories: [],
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
        state.categoryTypes = action.payload.categoryTypes ?? [];
        state.userCategories = action.payload.userCategories ?? [];
        state.placeCategories = action.payload.placeCategories ?? [];
        state.productCategories = action.payload.productCategories ?? [];
        state.eventCategories = action.payload.eventCategories ?? [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default appSlice.reducer;

export const selectCategoryTypes = (state: RootState) =>
  state.app.categoryTypes;
export const selectUserCategories = (state: RootState) =>
  state.app.userCategories;
export const selectPlaceCategories = (state: RootState) =>
  state.app.placeCategories;
export const selectProductCategories = (state: RootState) =>
  state.app.productCategories;
export const selectEventCategories = (state: RootState) =>
  state.app.eventCategories;
export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectAppError = (state: RootState) => state.app.error;
