import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { ReviewPopulated } from "@/types/review";

/**
 * Récupère les avis reçus sur le lieu de l'utilisateur connecté.
 * Utilise GET /api/reviews/received (le lieu est déterminé côté serveur via le token).
 */
export const useReviewsReceived = (userId?: string) => {
  const [reviews, setReviews] = useState<ReviewPopulated[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);
  showErrorRef.current = showError;

  const fetchReviews = useCallback(async () => {
    if (!userId) {
      setReviews([]);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/received`,
        { withCredentials: true }
      );
      const data = response.data?.data?.reviews ?? [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des avis reçus";
      setReviews([]);
      showErrorRef.current(message);
    }
  }, [userId]);

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
