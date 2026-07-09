import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useTranslation } from "react-i18next";
import { ReviewReferenceType } from "@/types/review";

interface SubmitReviewData {
  rating: number;
  comment?: string;
  reference: string;
  referenceType: ReviewReferenceType;
}

const useSubmitReview = () => {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { t } = useTranslation("reviews");

  const submitReview = async (data: SubmitReviewData) => {
    try {
      await withLoading(() =>
        apiClient.post(`/api/reviews`, data, {
          headers: {
            "Content-Type": "application/json",
          }
        })
      );
      showSuccess(t("useSubmitReview.success"));
      return true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return { submitReview, isLoading };
};

export default useSubmitReview;
