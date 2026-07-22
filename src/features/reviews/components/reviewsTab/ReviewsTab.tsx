import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import Button from "@/shared/ui/buttons/button";
import ReviewModal from "../reviewModal";
import ReviewCard from "../reviewCard";
import { useReviews } from "../../hooks/useReviews";
import { useAuth } from "@/features/auth";
import type { ReviewReferenceType, ReviewPopulated } from "../../types";
import type { UserPopulated } from "@/features/users/types";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import EmptyState from "@/shared/ui/noResults/emptyState";
import styles from "./ReviewsTab.module.scss";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

interface ReviewsTabProps {
  isOwner: boolean;
  reference: string;
  referenceType: ReviewReferenceType;
  canReview?: boolean;
  canReply?: boolean;
  onRatingUpdated?: () => void;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({
  isOwner,
  reference,
  referenceType,
  canReview = true,
  canReply = false,
  onRatingUpdated,
}) => {
  const { t } = useTranslation("reviews");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { reviews, isLoading, refetch } = useReviews({
    reference,
    referenceType,
  });
  const { user } = useAuth();

  const userReview = useMemo<ReviewPopulated | undefined>(() => {
    if (!user) return undefined;
    return reviews.find((review) => {
      const author = resolveRefObject(review.author);
      return author && author.id === user.id;
    });
  }, [reviews, user]);

  const sortedReviews = useMemo(() => {
    if (!userReview) return reviews;
    const otherReviews = reviews.filter(
      (review) => review.id !== userReview.id,
    );
    return [userReview, ...otherReviews];
  }, [reviews, userReview]);

  const handleReviewSuccess = () => {
    refetch();
    onRatingUpdated?.();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReply = (_reviewId: string) => {};

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.reviewsTab}>
      <div className={styles.header}>
        <h3>{t("reviewsTab.title", { count: reviews.length })}</h3>
        {user && canReview && !isOwner && (
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsModalOpen(true)}
            startIcon={<Star size={16} />}
          >
            {userReview
              ? t("reviewsTab.editReview")
              : t("reviewsTab.writeReview")}
          </Button>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title={t("reviewsTab.emptyTitle")}
          description={
            user && canReview
              ? t("reviewsTab.emptyDescriptionCanReview")
              : t("reviewsTab.emptyDescriptionNoReview")
          }
          icon={<Star className={styles.emptyIcon} />}
        />
      ) : (
        <div className={styles.reviewsList}>
          {sortedReviews.map((review, index) => {
            const isUserReview = userReview && review.id === userReview.id;
            const showSeparator =
              isUserReview && index === 0 && sortedReviews.length > 1;

            return (
              <React.Fragment key={review.id}>
                <ReviewCard
                  review={review}
                  user={user as UserPopulated}
                  onReply={user && canReply ? handleReply : undefined}
                  onReviewUpdated={handleReviewSuccess}
                  onReviewDeleted={handleReviewSuccess}
                />
                {showSeparator && <div className={styles.separator} />}
              </React.Fragment>
            );
          })}
        </div>
      )}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reference={reference}
        referenceType={referenceType}
        onSuccess={handleReviewSuccess}
        review={userReview}
      />
    </div>
  );
};

export default ReviewsTab;
