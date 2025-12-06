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
  reference: string;
  referenceType: ReviewReferenceType;
  canReview?: boolean;
  canReply?: boolean;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reference,
  referenceType,
  canReview = true,
  canReply = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { reviews, isLoading, refetch } = useReviews({
    reference,
    referenceType,
  });
  const { user } = useAuth();

  // Find if the current user has already left a review
  const userReview = useMemo<ReviewPopulated | undefined>(() => {
    if (!user) return undefined;
    return reviews.find((review) => {
      const author = typeof review.author === "object" ? review.author : null;
      return author && author._id === user._id;
    });
  }, [reviews, user]);

  const handleReviewSuccess = () => {
    refetch();
  };

  // Reply functionality is handled in ReviewCard
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReply = (_reviewId: string) => {
    // No-op: reply is handled internally by ReviewCard
  };

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.reviewsTab}>
      <div className={styles.header}>
        <h3>Avis ({reviews.length})</h3>
        {user && canReview && (
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
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onReply={user && canReply ? handleReply : undefined}
              onReviewUpdated={handleReviewSuccess}
              onReviewDeleted={handleReviewSuccess}
            />
          ))}
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
