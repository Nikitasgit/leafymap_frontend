import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const useSubmitPartnerships = (onUpdate?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  const submitPartnerships = async (
    partnerships: Partnership[],
    isUpdate: boolean = false,
    placeId: string,
    eventId: string = ""
  ) => {
    try {
      // Validate placeId before sending request
      if (!placeId || typeof placeId !== "string" || placeId.trim() === "") {
        throw new Error("Place ID is required and must be a valid string");
      }

      const filteredPartnerships = partnerships.map((partnership) => {
        if (isUpdate) {
          return {
            _id: partnership._id,
            deleted: partnership.deleted,
            status: partnership.status,
          };
        } else {
          return {
            collaborator: partnership.collaborator,
          };
        }
      });
      const method = isUpdate ? "put" : "post";
      await withLoading(() =>
        axios[method](
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnerships/${placeId}/${eventId}`,
          { partnerships: filteredPartnerships },
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
          : "Erreur lors de la mise à jour des partenariats";
      showError(errorMessage);
    }
  };

  return {
    isLoading,
    submitPartnerships,
  };
};
