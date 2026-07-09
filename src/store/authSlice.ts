import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient, isAxiosError } from "@/lib/api/client";
import type { RootState } from "./index";
import { User } from "@/types/user";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    try {
      const response = await apiClient.get("/api/auth/me");

      return response.data.data.user;
    } catch (error) {
      throw error;
    }
  },
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
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.post("/api/auth/signin", {
        identifier,
        password,
      });

      return response.data.data.user;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/auth/google", {
        id_token: idToken,
      });
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await apiClient.post("/api/auth/signout");
});

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const getRejectionMessage = (
  payload: unknown,
  errorMessage: string | undefined,
  fallback: string,
): string => {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }
  return errorMessage || fallback;
};

const initialState: AuthState = {
  user: null,
  loading: true,
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
      state.error = getRejectionMessage(
        action.payload,
        action.error.message,
        "Failed to sign in",
      );
    });

    // Sign in with Google
    builder.addCase(signInWithGoogle.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signInWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    });
    builder.addCase(signInWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = getRejectionMessage(
        action.payload,
        action.error.message,
        "Failed to sign in with Google",
      );
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
