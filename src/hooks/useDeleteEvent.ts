import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

const useDeleteEvent = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const deleteEvent = async (eventId: string, placeId: string) => {
    try {
      await withLoading(() =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}/events/${eventId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );

      showSuccess("Événement supprimé avec succès");
      window.location.reload();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        if (err.response.data.data) {
          Object.values(err.response.data.data).forEach((error: unknown) => {
            if (Array.isArray(error)) {
              error.forEach((e: string) => {
                showError(e);
              });
            } else if (typeof error === "string") {
              showError(error);
            }
          });
        } else {
          showError(err.response.data.message);
        }
      } else {
        showError("Une erreur inattendue s'est produite");
      }
    }
  };

  const deleteEventWithConfirmation = async (
    eventId: string,
    placeId: string
  ) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est définitive."
    );

    if (confirmed) {
      const doubleConfirmed = window.confirm(
        "Cette action est définitive. Confirmez-vous la suppression de l'événement ?"
      );

      if (doubleConfirmed) {
        await withLoading(() => deleteEvent(eventId, placeId));
      }
    }
  };

  return { deleteEvent: deleteEventWithConfirmation, isLoading };
};

export default useDeleteEvent;
