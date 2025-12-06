import { useState, useEffect } from "react";
import { ReviewPopulated } from "@/types/review";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import axios from "axios";

interface UseReviewsParams {
  reference?: string;
  referenceType?: "Place" | "Event" | "User";
  author?: string;
}

export const useReviews = (params?: UseReviewsParams) => {
  const [reviews, setReviews] = useState<ReviewPopulated[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchReviews = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.reference) queryParams.append("reference", params.reference);
      if (params?.referenceType)
        queryParams.append("referenceType", params.referenceType);
      if (params?.author) queryParams.append("author", params.author);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await axios.get(url);
      setReviews(response.data.data.reviews || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des avis";
      showError(errorMessage);
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
