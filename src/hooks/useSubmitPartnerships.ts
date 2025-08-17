import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const useSubmitPartnerships = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  const submitPartnerships = async (
    partnerships: Partnership[],
    isUpdate: boolean,
    placeId: string
  ) => {
    try {
      const filteredPartnerships = partnerships.map((partnership) => ({
        _id: partnership._id,
        deleted: partnership.deleted,
      }));
      const method = isUpdate ? "put" : "post";
      await withLoading(() =>
        axios[method](
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnerships/${
            isUpdate ? placeId : ""
          }`,
          { partnerships: filteredPartnerships },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour des partenariats";
      showError(errorMessage);
    }
  };

  return {
    isLoading,
    submitPartnerships,
  };
};
