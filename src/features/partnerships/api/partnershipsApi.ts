import { request } from "@/shared/api/client";
import type { Partnership } from "../types";

export type FetchPartnershipsParams = {
  status?: Partnership["status"];
  asCollaborator?: boolean;
  asInitiator?: boolean;
};

export type PartnershipUpdate = {
  id: string;
  status?: "pending" | "accepted";
  deleted?: boolean;
};

export const fetchUserPartnerships = async (
  userId: string,
  params: FetchPartnershipsParams = {},
): Promise<Partnership[]> => {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.append("status", params.status);
  if (params.asCollaborator) searchParams.append("asCollaborator", "true");
  if (params.asInitiator) searchParams.append("asInitiator", "true");

  const query = searchParams.toString();
  const data = await request<Partnership[]>({
    method: "GET",
    url: `/api/partnerships/user/${userId}${query ? `?${query}` : ""}`,
  });
  return Array.isArray(data) ? data : [];
};

export const createPartnership = async (
  collaboratorId: string,
): Promise<void> => {
  await request<void>({
    method: "POST",
    url: `/api/partnerships`,
    data: {
      partnership: {
        collaborator: { id: collaboratorId },
      },
    },
  });
};

export const deletePartnership = async (
  partnershipId: string,
): Promise<void> => {
  await request<void>({
    method: "DELETE",
    url: `/api/partnerships/${partnershipId}`,
  });
};

export const updatePartnerships = async (
  partnerships: PartnershipUpdate[],
): Promise<void> => {
  await request<void>({
    method: "PUT",
    url: `/api/partnerships/update`,
    data: { partnerships },
  });
};
