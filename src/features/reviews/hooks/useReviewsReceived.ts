import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import type { ReviewPopulated } from "../types";
import { fetchReceivedReviews } from "../api/reviewsApi";

/**
 * Récupère les avis reçus sur le lieu de l'utilisateur connecté.
 * Utilise GET /api/reviews/received (le lieu est déterminé côté serveur via le token).
 */
export const useReviewsReceived = (userId?: string) => {
  const { t } = useTranslation("account");

  const { data: reviews, isLoading, refetch } = useApiQuery<ReviewPopulated[]>(
    () => fetchReceivedReviews(),
    {
      initialData: [],
      enabled: !!userId,
      deps: [userId],
      errorMessage: t("useReviewsReceived.loadError"),
    },
  );

  return { reviews, isLoading, refetch };
};
