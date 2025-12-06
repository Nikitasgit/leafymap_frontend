import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

const useDeleteReview = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const deleteReview = async (reviewId: string) => {
    try {
      await withLoading(() =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );
      showSuccess("Avis supprimé avec succès");
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        showError(err.response.data.message || "Erreur lors de la suppression");
      } else {
        showError("Une erreur inattendue s'est produite");
      }
      throw err;
    }
  };

  return { deleteReview, isLoading };
};

export default useDeleteReview;
