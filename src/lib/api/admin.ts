import { apiClient } from "@/lib/api/client";
import { User } from "@/types/user";

export type AdminResource =
  | "events"
  | "places"
  | "images"
  | "reviews"
  | "comments";

export interface AdminContentItem {
  _id: string;
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
  const response = await apiClient.get<{ data: { users: User[] } }>(
    "/api/admin/users",
    {
      params: { email },
    },
  );
  return response.data.data.users;
};

export const getAdminUser = async (userId: string) => {
  const response = await apiClient.get<{ data: { user: User } }>(
    `/api/admin/users/${userId}`,
  );
  return response.data.data.user;
};

export const getAdminUserContent = async (userId: string) => {
  const response = await apiClient.get<{ data: { content: AdminUserContent } }>(
    `/api/admin/users/${userId}/content`,
  );
  return response.data.data.content;
};

export const banAdminUser = async (
  userId: string,
  payload: { reason: string; duration?: number },
) => apiClient.patch(`/api/admin/users/${userId}/ban`, payload);

export const unbanAdminUser = async (userId: string) =>
  apiClient.patch(`/api/admin/users/${userId}/unban`);

export const softDeleteAdminUser = async (userId: string) =>
  apiClient.patch(`/api/admin/users/${userId}/delete`);

export const restoreAdminUser = async (userId: string) =>
  apiClient.patch(`/api/admin/users/${userId}/restore`);

export const softDeleteAdminResource = async (
  resource: AdminResource,
  resourceId: string,
  reason?: string,
) => apiClient.patch(`/api/admin/${resource}/${resourceId}/delete`, { reason });

export const restoreAdminResource = async (
  resource: AdminResource,
  resourceId: string,
) => apiClient.patch(`/api/admin/${resource}/${resourceId}/restore`);
