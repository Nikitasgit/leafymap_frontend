import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const useSubmitEventInvitations = (onUpdate?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  const submitEventInvitations = async (
    eventInvitations: Partnership[],
    isUpdate: boolean = false,
    eventId: string
  ) => {
    try {
      const filteredEventInvitations = eventInvitations.map((invitation) => {
        if (isUpdate) {
          return {
            _id: invitation._id,
            deleted: invitation.deleted,
            status: invitation.status,
          };
        } else {
          return {
            collaborator: invitation.collaborator,
          };
        }
      });
      const method = isUpdate ? "put" : "post";
      await withLoading(() =>
        isUpdate
          ? axios[method](
              `${process.env.NEXT_PUBLIC_API_URL}/api/event-invitations`,
              { eventInvitations: filteredEventInvitations },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            )
          : axios[method](
              `${process.env.NEXT_PUBLIC_API_URL}/api/event-invitations/event/${eventId}`,
              { eventInvitations: filteredEventInvitations },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            )
      );
      onUpdate?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour des invitations d'événement";
      showError(errorMessage);
    }
  };

  return {
    isLoading,
    submitEventInvitations,
  };
};
