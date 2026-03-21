import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

const useDeletePlace = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const performDeletePlace = async (placeId: string) => {
    try {
      await withLoading(() =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );

      showSuccess("Lieu supprimé avec succès");
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

  const deletePlaceWithConfirmation = async (placeId: string) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce lieu ? Cette action supprimera également tous les événements, avis et commentaires associés."
    );

    if (confirmed) {
      const doubleConfirmed = window.confirm(
        "Cette action est définitive. Les événements, avis et commentaires liés à ce lieu seront supprimés. Confirmez-vous la suppression ?"
      );

      if (doubleConfirmed) {
        await performDeletePlace(placeId);
      }
    }
  };

  return {
    deletePlace: deletePlaceWithConfirmation,
    performDeletePlace,
    isLoading,
  };
};

export default useDeletePlace;
