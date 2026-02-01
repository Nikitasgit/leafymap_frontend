import React, { useState, useMemo } from "react";
import { Star } from "lucide-react";
import Button from "@/components/common/buttons/Button/Button";
import ReviewModal from "../ReviewModal/ReviewModal";
import ReviewCard from "../ReviewCard/ReviewCard";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { ReviewReferenceType, ReviewPopulated } from "@/types/review";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import EmptyState from "@/components/common/noResults/EmptyState";
import styles from "./ReviewsTab.module.scss";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { reviews, isLoading, refetch } = useReviews({
    reference,
    referenceType,
  });
  const { user } = useAuth();

  const userReview = useMemo<ReviewPopulated | undefined>(() => {
    if (!user) return undefined;
    return reviews.find((review) => {
      const author = typeof review.author === "object" ? review.author : null;
      return author && author._id === user._id;
    });
  }, [reviews, user]);

  const sortedReviews = useMemo(() => {
    if (!userReview) return reviews;
    const otherReviews = reviews.filter(
      (review) => review._id !== userReview._id
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
        <h3>Avis ({reviews.length})</h3>
        {user && canReview && !isOwner && (
          <Button
            variant="primary"
            size="small"
            onClick={() => setIsModalOpen(true)}
            startIcon={<Star size={16} />}
          >
            {userReview ? "Modifier mon avis" : "Rédiger un avis"}
          </Button>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title="Aucun avis pour le moment"
          description={
            user && canReview
              ? "Soyez le premier à laisser un avis !"
              : "Il n'y a pas encore d'avis sur cet élément."
          }
          icon={<Star className={styles.emptyIcon} />}
        />
      ) : (
        <div className={styles.reviewsList}>
          {sortedReviews.map((review, index) => {
            const isUserReview = userReview && review._id === userReview._id;
            const showSeparator =
              isUserReview && index === 0 && sortedReviews.length > 1;

            return (
              <React.Fragment key={review._id}>
                <ReviewCard
                  review={review}
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
