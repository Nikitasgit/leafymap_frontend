"use client";

import React from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useReviewsReceived } from "@/hooks/useReviewsReceived";
import ReviewCard from "@/components/reviews/ReviewCard/ReviewCard";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import EmptyState from "@/components/common/noResults/EmptyState";
import styles from "./ReviewsReceivedTab.module.scss";
import { UserPopulated } from "@/types/user";

export default function ReviewsReceivedTab() {
  const { user, loading: isLoadingUser } = useAuth();
  const { reviews, isLoading, refetch } = useReviewsReceived(user?._id);

  if (isLoadingUser || isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.reviewsReceivedTab}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Star size={20} className={styles.icon} />
            Avis reçus
          </p>
          <p className={styles.info}>
            Les avis laissés par les utilisateurs sur votre lieu (vérifié via
            votre compte).
          </p>
        </div>
      </div>
      {reviews.length === 0 ? (
        <EmptyState
          title="Aucun avis reçu"
          description="Votre lieu n'a pas encore reçu d'avis, ou vous n'avez pas de lieu associé à votre compte."
          icon={<Star className={styles.emptyIcon} />}
        />
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <li key={review._id}>
              <ReviewCard
                review={review}
                user={user as UserPopulated}
                onReviewUpdated={refetch}
                onReply={() => {}}
                onReviewDeleted={refetch}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
