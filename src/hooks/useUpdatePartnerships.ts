import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const useUpdatePartnerships = () => {
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const updatePartnerships = async (
    partnerships: Partnership[],
    placeId: string
  ) => {
    try {
      const filteredPartnerships = partnerships.map((partnership) => ({
        _id: partnership._id,
        deleted: partnership.deleted,
      }));

      await withLoading(() =>
        axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnerships/${placeId}`,
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
    loading: isLoading,
    updatePartnerships,
  };
};
