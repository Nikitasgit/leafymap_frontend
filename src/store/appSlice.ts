import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./index";
import { Category, PlaceCategory, SubCategory } from "@/types/categories";

export const fetchCategories = createAsyncThunk(
  "app/fetchCategories",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
    );
    console.log(response.data);
    return response.data;
  }
);

type AppState = {
  subCategories: SubCategory[];
  placeCategories: PlaceCategory[];
  categories: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: AppState = {
  subCategories: [],
  placeCategories: [],
  categories: [],
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
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload.subCategories;
        state.categories = action.payload.categories;
        state.placeCategories = action.payload.placeCategories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });
  },
});

export default appSlice.reducer;

export const selectSubCategories = (state: RootState) =>
  state.app.subCategories;
export const selectCategories = (state: RootState) => state.app.categories;
export const selectPlaceCategories = (state: RootState) =>
  state.app.placeCategories;
