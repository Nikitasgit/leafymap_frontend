import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { deleteReview as deleteReviewApi } from "../api/reviewsApi";

const useDeleteReview = () => {
  const { t } = useTranslation("reviews");
  const { mutate, isLoading } = useApiMutation(
    async (reviewId: string) => {
      await deleteReviewApi(reviewId);
      return true as const;
    },
    { successMessage: t("useDeleteReview.success"), rethrow: true },
  );

  return { deleteReview: mutate, isLoading };
};

export default useDeleteReview;
