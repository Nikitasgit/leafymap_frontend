import { request } from "@/shared/api/client";
import { User } from "@/features/users/types";

export type AdminResource =
  | "events"
  | "places"
  | "images"
  | "reviews"
  | "comments";

export interface AdminContentItem {
  id: string;
  name?: string;
  location?: { label?: string };
  type?: string;
  referenceType?: string;
  rating?: number;
  comment?: string;
  content?: string;
  status?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AdminUserContent = Record<AdminResource, AdminContentItem[]>;

export const searchAdminUsers = async (email: string) => {
  const data = await request<{ users: User[] }>({
    method: "GET",
    url: "/api/admin/users",
    params: { email },
  });
  return data.users;
};

export const getAdminUser = async (userId: string) => {
  const data = await request<{ user: User }>({
    method: "GET",
    url: `/api/admin/users/${userId}`,
  });
  return data.user;
};

export const getAdminUserContent = async (userId: string) => {
  const data = await request<{ content: AdminUserContent }>({
    method: "GET",
    url: `/api/admin/users/${userId}/content`,
  });
  return data.content;
};

export const banAdminUser = async (
  userId: string,
  payload: { reason: string; duration?: number },
) =>
  request<unknown>({
    method: "PATCH",
    url: `/api/admin/users/${userId}/ban`,
    data: payload,
  });

export const unbanAdminUser = async (userId: string) =>
  request<unknown>({
    method: "PATCH",
    url: `/api/admin/users/${userId}/unban`,
  });

export const softDeleteAdminUser = async (userId: string) =>
  request<unknown>({
    method: "PATCH",
    url: `/api/admin/users/${userId}/delete`,
  });

export const restoreAdminUser = async (userId: string) =>
  request<unknown>({
    method: "PATCH",
    url: `/api/admin/users/${userId}/restore`,
  });

export const softDeleteAdminResource = async (
  resource: AdminResource,
  resourceId: string,
  reason?: string,
) =>
  request<unknown>({
    method: "PATCH",
    url: `/api/admin/${resource}/${resourceId}/delete`,
    data: { reason },
  });

export const restoreAdminResource = async (
  resource: AdminResource,
  resourceId: string,
) =>
  request<unknown>({
    method: "PATCH",
    url: `/api/admin/${resource}/${resourceId}/restore`,
  });
