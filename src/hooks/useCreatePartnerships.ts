import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const useCreatePartnerships = () => {
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const createPartnerships = async (
    partnerships: Partnership[],
    placeId: string,
    eventId?: string
  ) => {
    const filteredPartnerships = partnerships.map((partnership) => ({
      _id: partnership._id,
      collaborator: { _id: partnership.collaborator._id },
    }));
    try {
      await withLoading(() =>
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnerships/${placeId}${
            eventId ? `/${eventId}` : ""
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
          : "Erreur lors de la création des partenariats";
      showError(errorMessage);
    }
  };

  return {
    loading: isLoading,
    createPartnerships,
  };
};
