import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "@/shared/api/client";
import { authApi } from "../api/authApi";
import type { RootState } from "@/store";
import { User } from "@/features/users/types";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    return authApi.getMe();
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
      return await authApi.signIn({ identifier, password });
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
      return await authApi.signInWithGoogle(idToken);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await authApi.signOut();
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
