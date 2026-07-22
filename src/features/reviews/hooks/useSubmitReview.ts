import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import {
  createReview,
  type CreateReviewData,
} from "../api/reviewsApi";

const useSubmitReview = () => {
  const { t } = useTranslation("reviews");
  const { mutate, isLoading } = useApiMutation(
    async (data: CreateReviewData) => {
      await createReview(data);
      return true as const;
    },
    { successMessage: t("useSubmitReview.success") },
  );

  return { submitReview: mutate, isLoading };
};

export default useSubmitReview;
