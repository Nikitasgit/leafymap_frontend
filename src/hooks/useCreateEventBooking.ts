import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useCreateEventBooking = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const createEventBooking = async (eventId: string, seats: number) => {
    try {
      const response = await withLoading(() =>
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event-bookings/event/${eventId}`,
          { seats },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
      );
      showSuccess("Réservation confirmée avec succès");
      return response.data.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Erreur lors de la réservation"
        : "Erreur lors de la réservation";
      showError(errorMessage);
      throw err;
    }
  };

  return { createEventBooking, isLoading };
};

