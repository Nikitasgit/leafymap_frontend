import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import type { ReviewPopulated } from "../types";
import { fetchReviews, type FetchReviewsParams } from "../api/reviewsApi";

export type UseReviewsParams = FetchReviewsParams;

export const useReviews = (params?: UseReviewsParams) => {
  const { t } = useTranslation("reviews");
  const enabled = Boolean(params?.reference && params?.referenceType);

  const { data: reviews, isLoading, refetch } = useApiQuery<ReviewPopulated[]>(
    () => fetchReviews(params),
    {
      initialData: [],
      enabled,
      deps: [params?.reference, params?.referenceType, params?.author],
      errorMessage: t("useReviews.loadError"),
    },
  );

  return { reviews, isLoading, refetch };
};
