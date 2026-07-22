import { request } from "@/shared/api/client";
import type { EventInvitationPopulated } from "../types/eventInvitation";

export const fetchEventInvitationsByEvent = async (
  eventId: string,
  queryParams: Record<string, string> = {},
): Promise<EventInvitationPopulated[]> => {
  const data = await request<EventInvitationPopulated[]>({
    method: "GET",
    url: `/api/event-invitations/event/${eventId}`,
    params: queryParams,
  });
  return Array.isArray(data) ? data : [];
};

export const fetchEventInvitationsByUserId = async (
  userId: string,
  queryParams: Record<string, string> = {},
): Promise<EventInvitationPopulated[]> => {
  const data = await request<EventInvitationPopulated[]>({
    method: "GET",
    url: `/api/event-invitations/user/${userId}`,
    params: queryParams,
  });
  return Array.isArray(data) ? data : [];
};

export const createEventInvitations = async (
  eventId: string,
  eventInvitations: unknown[],
): Promise<void> => {
  await request<void>({
    method: "POST",
    url: `/api/event-invitations/event/${eventId}`,
    data: { eventInvitations },
  });
};

export const updateEventInvitations = async (
  eventInvitations: unknown[],
): Promise<void> => {
  await request<void>({
    method: "PUT",
    url: `/api/event-invitations`,
    data: { eventInvitations },
  });
};
