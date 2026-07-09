import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useTranslation } from "react-i18next";

interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

const useUpdateReview = () => {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { t } = useTranslation("reviews");

  const updateReview = async (reviewId: string, data: UpdateReviewData) => {
    try {
      await withLoading(() =>
        apiClient.put(
          `/api/reviews/${reviewId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );
      showSuccess(t("useUpdateReview.success"));
      return true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return { updateReview, isLoading };
};

export default useUpdateReview;
