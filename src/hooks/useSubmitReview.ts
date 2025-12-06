import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { ReviewReferenceType } from "@/types/review";

interface SubmitReviewData {
  rating: number;
  comment?: string;
  reference: string;
  referenceType: ReviewReferenceType;
}

const useSubmitReview = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const submitReview = async (data: SubmitReviewData) => {
    try {
      await withLoading(() =>
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, data, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
      );
      showSuccess("Avis publié avec succès");
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        if (err.response.data.data) {
          Object.values(err.response.data.data).forEach((error: unknown) => {
            if (Array.isArray(error)) {
              error.forEach((e: string) => {
                showError(e);
              });
            } else if (typeof error === "string") {
              showError(error);
            }
          });
        } else {
          showError(err.response.data.message);
        }
      } else {
        showError("Une erreur inattendue s'est produite");
      }
      throw err;
    }
  };

  return { submitReview, isLoading };
};

export default useSubmitReview;
