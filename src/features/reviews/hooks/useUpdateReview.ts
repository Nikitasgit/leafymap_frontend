import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import {
  updateReview as updateReviewApi,
  type UpdateReviewData,
} from "../api/reviewsApi";

const useUpdateReview = () => {
  const { t } = useTranslation("reviews");
  const { mutate, isLoading } = useApiMutation(
    async (reviewId: string, data: UpdateReviewData) => {
      await updateReviewApi(reviewId, data);
      return true as const;
    },
    { successMessage: t("useUpdateReview.success") },
  );

  return { updateReview: mutate, isLoading };
};

export default useUpdateReview;
