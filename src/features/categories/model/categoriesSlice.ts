import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories as fetchCategoriesRequest } from "@/shared/api/categoriesApi";
import type { RootState } from "@/store";
import type {
  CategoryType,
  EventCategory,
  PlaceCategory,
  UserCategory,
} from "@/shared/types/categories";
import type { ProductCategory } from "@/features/products/types";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return fetchCategoriesRequest();
  }
);

type CategoriesState = {
  categoryTypes: CategoryType[];
  userCategories: UserCategory[];
  placeCategories: PlaceCategory[];
  productCategories: ProductCategory[];
  eventCategories: EventCategory[];
  loading: boolean;
  error: string | null;
};

const initialState: CategoriesState = {
  categoryTypes: [],
  userCategories: [],
  placeCategories: [],
  productCategories: [],
  eventCategories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
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

export default categoriesSlice.reducer;

export const selectCategoryTypes = (state: RootState) =>
  state.categories.categoryTypes;
export const selectUserCategories = (state: RootState) =>
  state.categories.userCategories;
export const selectPlaceCategories = (state: RootState) =>
  state.categories.placeCategories;
export const selectProductCategories = (state: RootState) =>
  state.categories.productCategories;
export const selectEventCategories = (state: RootState) =>
  state.categories.eventCategories;
export const selectCategoriesLoading = (state: RootState) =>
  state.categories.loading;
export const selectCategoriesError = (state: RootState) =>
  state.categories.error;

/** @deprecated Use selectCategoriesLoading */
export const selectAppLoading = selectCategoriesLoading;
/** @deprecated Use selectCategoriesError */
export const selectAppError = selectCategoriesError;
