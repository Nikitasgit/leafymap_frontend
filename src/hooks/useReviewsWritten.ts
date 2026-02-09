import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { ReviewPopulated } from "@/types/review";

export const useReviewsWritten = (userId?: string) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/my-reviews`,
        { withCredentials: true }
      );
      const data = response.data?.data?.reviews ?? [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des avis rédigés";
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
