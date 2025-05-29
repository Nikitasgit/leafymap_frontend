import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./index";
import axios from "axios";
import { Creator, User } from "@/types/user";
import { Place } from "@/types/place";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
    {
      withCredentials: true,
    }
  );
  return response.data.user;
});

export type UserState = {
  user: User | null;
  loading: boolean;
  error: string;
  fetched: boolean;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: "",
    fetched: false,
  },
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.error = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.fetched = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
        state.fetched = true;
      });
  },
});

export const { signOut } = userSlice.actions;
export const selectUser = (state: RootState): UserState => state.user;
export const selectUserCreatorPlace = (state: RootState): Place | null => {
  const user = state.user.user as Creator | null;
  const creatorPlace = user?.creatorProfile?.place;
  return creatorPlace && typeof creatorPlace !== "string" ? creatorPlace : null;
};
export default userSlice.reducer;
