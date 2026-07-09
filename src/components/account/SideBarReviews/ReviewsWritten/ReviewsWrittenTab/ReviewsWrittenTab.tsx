"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useReviewsWritten } from "@/hooks/useReviewsWritten";
import ReviewCard from "@/components/reviews/ReviewCard";
import CreatorCardWithAddress from "@/components/common/CreatorCardWithAddress";
import AccountTabShell from "@/components/account/AccountTabShell";
import type {
  ReviewWithReferencePopulated,
  ReviewReferencePlacePopulated,
} from "@/types/review";
import styles from "./ReviewsWrittenTab.module.scss";

function isPlaceReferencePopulated(
  review: ReviewWithReferencePopulated,
): review is ReviewWithReferencePopulated & {
  reference: ReviewReferencePlacePopulated;
} {
  if (review.referenceType !== "Place") return false;
  const ref = review.reference;
  return typeof ref === "object" && ref !== null;
}

export default function ReviewsWrittenTab() {
  const { t } = useTranslation("account");
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { reviews, isLoading: isLoadingReviews, refetch } = useReviewsWritten(
    user?._id,
  );

  return (
    <AccountTabShell
      icon={<MessageSquare size={20} />}
      title={t("reviewsWrittenTab.title")}
      description={t("reviewsWrittenTab.description")}
      isLoading={isLoadingUser || isLoadingReviews}
      isEmpty={reviews.length === 0}
      emptyTitle={t("reviewsWrittenTab.emptyTitle")}
      emptyMessage={t("reviewsWrittenTab.emptyMessage")}
    >
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
                  username={ref.user?.username ?? t("reviewsWrittenTab.placeFallback")}
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
    </AccountTabShell>
  );
}
