import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useTranslation } from "react-i18next";

const useDeletePlace = () => {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { t } = useTranslation("account");

  const performDeletePlace = async (placeId: string) => {
    try {
      await withLoading(() =>
        apiClient.delete(
          `/api/places/${placeId}`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );

      showSuccess(t("useDeletePlace.deleteSuccess"));
      window.location.reload();
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  const deletePlaceWithConfirmation = async (placeId: string) => {
    const confirmed = window.confirm(t("useDeletePlace.confirmFirst"));

    if (confirmed) {
      const doubleConfirmed = window.confirm(t("useDeletePlace.confirmSecond"));

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
