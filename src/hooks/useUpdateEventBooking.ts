import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useUpdateEventBooking = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const updateEventBooking = async (bookingId: string, seats: number) => {
    try {
      const response = await withLoading(() =>
        axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event-bookings/${bookingId}`,
          { seats },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
      );
      showSuccess("Réservation modifiée avec succès");
      return response.data.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Erreur lors de la modification"
        : "Erreur lors de la modification";
      showError(errorMessage);
      throw err;
    }
  };

  return { updateEventBooking, isLoading };
};

