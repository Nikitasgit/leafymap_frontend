import { useApiMutation } from "@/shared/hooks/useApiMutation";
import type { Partnership } from "@/features/partnerships/types";
import {
  createEventInvitations,
  updateEventInvitations,
} from "../api/eventInvitationsApi";

export const useSubmitEventInvitations = (onUpdate?: () => void) => {
  const { mutate, isLoading } = useApiMutation(
    async (
      eventInvitations: Partnership[],
      isUpdate: boolean = false,
      eventId?: string,
    ) => {
      const filteredEventInvitations = eventInvitations.map((invitation) => {
        if (isUpdate) {
          return {
            id: invitation.id,
            deleted: invitation.deleted,
            status: invitation.status,
          };
        } else {
          return {
            collaborator: invitation.collaborator,
          };
        }
      });
      if (isUpdate) {
        await updateEventInvitations(filteredEventInvitations);
      } else {
        await createEventInvitations(eventId as string, filteredEventInvitations);
      }
      onUpdate?.();
    },
  );

  return {
    isLoading,
    submitEventInvitations: mutate,
  };
};
