import { useState, useEffect, useCallback, useRef } from "react";
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
  const showErrorRef = useRef(showError);
  showErrorRef.current = showError;

  const fetchReviews = useCallback(async () => {
    if (!userId) {
      setReviews([]);
      return;
    }
    try {
      const response = await apiClient.get(`/api/reviews/received`, {});
      const data = response.data?.data?.reviews ?? [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setReviews([]);
      showErrorRef.current(
        getErrorMessage(err, t, t("useReviewsReceived.loadError")),
      );
    }
  }, [userId, t]);

  useEffect(() => {
    if (userId) {
      withLoading(fetchReviews);
    } else {
      setReviews([]);
    }
  }, [userId, fetchReviews]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    reviews,
    isLoading,
    refetch: fetchReviews,
  };
};
