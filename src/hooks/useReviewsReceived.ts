import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { ReviewPopulated } from "@/types/review";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

/**
 * Récupère les avis reçus sur le lieu de l'utilisateur connecté.
 * Utilise GET /api/reviews/received (le lieu est déterminé côté serveur via le token).
 */
export const useReviewsReceived = (userId?: string) => {
  const [reviews, setReviews] = useState<ReviewPopulated[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("account");

  const fetchReviews = useCallback(async () => {
    if (!userId) {
      return;
    }
    try {
      const response = await apiClient.get(`/api/reviews/received`, {});
      const data = response.data?.data?.reviews ?? [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setReviews([]);
      showError(getErrorMessage(err, t, t("useReviewsReceived.loadError")));
    }
  }, [userId, t, showError]);

  useEffect(() => {
    if (!userId) return;
    void withLoading(fetchReviews);
  }, [userId, fetchReviews, withLoading]);

  return {
    reviews: userId ? reviews : [],
    isLoading,
    refetch: fetchReviews,
  };
};
