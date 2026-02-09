import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./index";
import { signOut } from "./authSlice";
import type { Notification } from "@/types/notifications";

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
  notifications: Notification[];
  unreadConversations: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
};

const initialState: NotificationState = {
  notifications: [],
  unreadConversations: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.notifications = [];
      state.unreadConversations = 0;
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
        const payload = action.payload;
        state.notifications = Array.isArray(payload?.notifications)
          ? payload.notifications
          : [];
        state.unreadConversations = payload?.unreadConversations ?? 0;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
      .addCase(signOut.fulfilled, (state) => {
        state.notifications = [];
        state.unreadConversations = 0;
        state.error = null;
        state.lastFetched = null;
      });
  },
});

export default notificationSlice.reducer;

export const { resetNotifications } = notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications;

export const selectNotificationsList = (state: RootState): Notification[] =>
  state.notifications.notifications;

export const selectUnreadCount = (state: RootState): number =>
  state.notifications.notifications.filter((n) => n.read !== true).length;

export const selectUnreadConversations = (state: RootState): number =>
  state.notifications.unreadConversations;
