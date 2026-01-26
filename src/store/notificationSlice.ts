import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./index";

export const fetchUserNotifications = createAsyncThunk(
  "notifications/fetchUserNotifications",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
        {
          withCredentials: true,
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

type NotificationState = {
  messages: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
};

const initialState: NotificationState = {
  messages: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.messages = 0;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.messages =
          action.payload.messages;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      });
  },
});

export default notificationSlice.reducer;

export const { resetNotifications } = notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications;
export const selectUnreadMessagesCount = (state: RootState) =>
  state.notifications.messages;
