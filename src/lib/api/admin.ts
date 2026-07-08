import axios from "axios";
import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

const request = axios.create({
  baseURL: `${API_URL}/api/admin`,
  withCredentials: true,
});

export const searchAdminUsers = async (email: string) => {
  const response = await request.get<{ data: { users: User[] } }>("/users", {
    params: { email },
  });
  return response.data.data.users;
};

export const getAdminUser = async (userId: string) => {
  const response = await request.get<{ data: { user: User } }>(
    `/users/${userId}`
  );
  return response.data.data.user;
};

export const getAdminUserContent = async (userId: string) => {
  const response = await request.get<{ data: { content: AdminUserContent } }>(
    `/users/${userId}/content`
  );
  return response.data.data.content;
};

export const banAdminUser = async (
  userId: string,
  payload: { reason: string; duration?: number }
) => request.patch(`/users/${userId}/ban`, payload);

export const unbanAdminUser = async (userId: string) =>
  request.patch(`/users/${userId}/unban`);

export const softDeleteAdminUser = async (userId: string) =>
  request.patch(`/users/${userId}/delete`);

export const restoreAdminUser = async (userId: string) =>
  request.patch(`/users/${userId}/restore`);

export const softDeleteAdminResource = async (
  resource: AdminResource,
  resourceId: string,
  reason?: string
) => request.patch(`/${resource}/${resourceId}/delete`, { reason });

export const restoreAdminResource = async (
  resource: AdminResource,
  resourceId: string
) => request.patch(`/${resource}/${resourceId}/restore`);
