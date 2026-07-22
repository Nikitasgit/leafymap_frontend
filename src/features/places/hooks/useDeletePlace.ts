import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { confirmTwice } from "@/shared/utils/confirmTwice";
import { deletePlace } from "../api/placesApi";

const useDeletePlace = () => {
  const { t } = useTranslation("account");

  const { mutate: performDeletePlace, isLoading } = useApiMutation(
    async (placeId: string) => {
      await deletePlace(placeId);
      return true as const;
    },
    { successMessage: t("useDeletePlace.deleteSuccess") },
  );

  const deletePlaceWithConfirmation = async (placeId: string) => {
    if (
      !confirmTwice({
        first: t("useDeletePlace.confirmFirst"),
        second: t("useDeletePlace.confirmSecond"),
      })
    ) {
      return;
    }
    return performDeletePlace(placeId);
  };

  return {
    deletePlace: deletePlaceWithConfirmation,
    performDeletePlace,
    isLoading,
  };
};

export default useDeletePlace;
