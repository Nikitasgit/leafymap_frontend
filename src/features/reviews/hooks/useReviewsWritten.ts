import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import type { ReviewPopulated } from "../types";
import { fetchMyReviews } from "../api/reviewsApi";

export const useReviewsWritten = (userId?: string) => {
  const { t } = useTranslation("account");

  const { data: reviews, isLoading, refetch } = useApiQuery<ReviewPopulated[]>(
    () => fetchMyReviews(),
    {
      initialData: [],
      enabled: !!userId,
      deps: [userId],
      errorMessage: t("useReviewsWritten.loadError"),
    },
  );

  return { reviews, isLoading, refetch };
};
