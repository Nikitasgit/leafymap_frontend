import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

const useDeletePartnership = (onDelete?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const deletePartnership = async (
    partnershipId: string,
    successMessage?: string
  ) => {
    try {
      await withLoading(() =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnerships/${partnershipId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );
      showSuccess(successMessage ?? "Collaboration supprimée");
      onDelete?.();
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        showError(
          (err.response.data as { message?: string }).message ||
            "Erreur lors de la suppression"
        );
      } else {
        showError("Erreur lors de la suppression de la collaboration");
      }
      throw err;
    }
  };

  return { deletePartnership, isLoading };
};

export default useDeletePartnership;
