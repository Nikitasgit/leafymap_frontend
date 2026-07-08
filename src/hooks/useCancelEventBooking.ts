import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useCancelEventBooking = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const cancelEventBooking = async (bookingId: string) => {
    try {
      await withLoading(() =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event-bookings/${bookingId}`,
          { withCredentials: true }
        )
      );
      showSuccess("Réservation annulée avec succès");
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Erreur lors de l'annulation"
        : "Erreur lors de l'annulation";
      showError(errorMessage);
      throw err;
    }
  };

  return { cancelEventBooking, isLoading };
};
