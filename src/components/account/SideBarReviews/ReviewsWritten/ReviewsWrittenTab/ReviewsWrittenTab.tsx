"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useReviewsWritten } from "@/hooks/useReviewsWritten";
import ReviewCard from "@/components/reviews/ReviewCard";
import CreatorCardWithAddress from "@/components/common/CreatorCardWithAddress";
import LoadingBar from "@/components/common/loading/LoadingBar";
import EmptyState from "@/components/common/noResults/EmptyState";
import type {
  ReviewWithReferencePopulated,
  ReviewReferencePlacePopulated,
} from "@/types/review";
import styles from "./ReviewsWrittenTab.module.scss";

function isPlaceReferencePopulated(
  review: ReviewWithReferencePopulated
): review is ReviewWithReferencePopulated & {
  reference: ReviewReferencePlacePopulated;
} {
  if (review.referenceType !== "Place") return false;
  const ref = review.reference;
  return typeof ref === "object" && ref !== null;
}

export default function ReviewsWrittenTab() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { reviews, isLoading: isLoadingReviews, refetch } = useReviewsWritten(
    user?._id
  );

  if (isLoadingUser || isLoadingReviews) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.reviewsWrittenTab}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <MessageSquare size={20} className={styles.icon} />
            Avis rédigés
          </p>
          <p className={styles.info}>
            Les avis que vous avez rédigés sur des lieux ou des évènements.
          </p>
        </div>
      </div>
      {reviews.length === 0 ? (
        <EmptyState
          title="Aucun avis rédigé"
          description="Vous n'avez pas encore rédigé d'avis."
          icon={<MessageSquare className={styles.emptyIcon} />}
        />
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => {
            const typedReview = review as ReviewWithReferencePopulated;
            const withPlaceRef = isPlaceReferencePopulated(typedReview);
            const ref: ReviewReferencePlacePopulated | null =
              withPlaceRef && typeof typedReview.reference === "object"
                ? typedReview.reference
                : null;
            return (
              <li key={review._id} className={styles.reviewItem}>
                {ref && (
                  <CreatorCardWithAddress
                    imageUrl={ref.user?.image?.urls?.thumbnail}
                    username={ref.user?.username ?? "Lieu"}
                    address={ref.location?.label ?? ""}
                    className={styles.creatorCard}
                  />
                )}
                <ReviewCard
                  review={review}
                  user={user!}
                  onReviewUpdated={refetch}
                  onReviewDeleted={refetch}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
