import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { ReviewPopulated } from "@/types/review";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

interface UseReviewsParams {
  reference?: string;
  referenceType?: "Place" | "Event";
  author?: string;
}

export const useReviews = (params?: UseReviewsParams) => {
  const [reviews, setReviews] = useState<ReviewPopulated[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("reviews");

  const fetchReviews = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.reference) queryParams.append("reference", params.reference);
      if (params?.referenceType)
        queryParams.append("referenceType", params.referenceType);
      if (params?.author) queryParams.append("author", params.author);

      const url = `/api/reviews${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiClient.get(url);
      setReviews(response.data.data.reviews || []);
    } catch (err) {
      showError(getErrorMessage(err, t, t("useReviews.loadError")));
      setReviews([]);
    }
  };

  useEffect(() => {
    if (params?.reference && params?.referenceType) {
      withLoading(fetchReviews);
    }
  }, [params?.reference, params?.referenceType, params?.author]); // eslint-disable-line react-hooks/exhaustive-deps

  return { reviews, isLoading, refetch: fetchReviews };
};
