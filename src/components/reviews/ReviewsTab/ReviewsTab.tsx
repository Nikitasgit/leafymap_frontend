import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import Button from "@/components/common/buttons/Button";
import ReviewModal from "../ReviewModal";
import ReviewCard from "../ReviewCard";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { ReviewReferenceType, ReviewPopulated } from "@/types/review";
import { UserPopulated } from "@/types/user";
import LoadingBar from "@/components/common/loading/LoadingBar";
import EmptyState from "@/components/common/noResults/EmptyState";
import styles from "./ReviewsTab.module.scss";
import useDeleteReview from "@/hooks/useDeleteReview";
import useDeleteComment from "@/hooks/useDeleteComment";

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
  const { deleteReview, isLoading: isDeleting } = useDeleteReview();
  const { deleteComment, isLoading: isDeletingComment } = useDeleteComment();
  const { user } = useAuth();

  const userReview = useMemo<ReviewPopulated | undefined>(() => {
    if (!user) return undefined;
    return reviews.find((review) => {
      const author = typeof review.author === "object" ? review.author : null;
      return author && author.id === user.id;
    });
  }, [reviews, user]);

  const sortedReviews = useMemo(() => {
    if (!userReview) return reviews;
    const otherReviews = reviews.filter(
      (review) => review.id !== userReview.id
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
            {userReview ? t("reviewsTab.editReview") : t("reviewsTab.writeReview")}
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
