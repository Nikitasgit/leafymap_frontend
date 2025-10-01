import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./index";
import { User } from "@/types/user";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          withCredentials: true,
        }
      );

      return response.data.data.user;
    } catch (error) {
      throw error;
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    {
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
        {
          identifier,
          password,
        },
        { withCredentials: true }
      );

      return response.data.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`,
    {},
    { withCredentials: true }
  );
});

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch current user
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch current user";
    });

    // Sign in
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to sign in";
    });

    // Sign out
    builder.addCase(signOut.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
  },
});

export default authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;
