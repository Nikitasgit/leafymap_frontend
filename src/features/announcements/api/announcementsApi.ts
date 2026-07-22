import { request } from "@/shared/api/client";
import type {
  ActiveAnnouncement,
  Announcement,
  AnnouncementInput,
  AnnouncementLocale,
} from "../types";

export const getActiveAnnouncements = async (locale: AnnouncementLocale) => {
  const data = await request<{ announcements: ActiveAnnouncement[] }>({
    method: "GET",
    url: "/api/announcements",
    params: { locale },
  });
  return data.announcements;
};

export const listAdminAnnouncements = async () => {
  const data = await request<{ announcements: Announcement[] }>({
    method: "GET",
    url: "/api/admin/announcements",
  });
  return data.announcements;
};

export const getAdminAnnouncement = async (id: string) => {
  const data = await request<{ announcement: Announcement }>({
    method: "GET",
    url: `/api/admin/announcements/${id}`,
  });
  return data.announcement;
};

export const createAdminAnnouncement = async (payload: AnnouncementInput) => {
  const data = await request<{ announcement: Announcement }>({
    method: "POST",
    url: "/api/admin/announcements",
    data: payload,
  });
  return data.announcement;
};

export const updateAdminAnnouncement = async (
  id: string,
  payload: Partial<AnnouncementInput>,
) => {
  const data = await request<{ announcement: Announcement }>({
    method: "PATCH",
    url: `/api/admin/announcements/${id}`,
    data: payload,
  });
  return data.announcement;
};

export const publishAdminAnnouncement = async (id: string) => {
  const data = await request<{ announcement: Announcement }>({
    method: "POST",
    url: `/api/admin/announcements/${id}/publish`,
  });
  return data.announcement;
};

export const archiveAdminAnnouncement = async (id: string) => {
  const data = await request<{ announcement: Announcement }>({
    method: "POST",
    url: `/api/admin/announcements/${id}/archive`,
  });
  return data.announcement;
};

export const deleteAdminAnnouncement = async (id: string) => {
  await request<unknown>({
    method: "POST",
    url: `/api/admin/announcements/${id}/delete`,
  });
};
