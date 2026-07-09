import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StarsReview from "@/components/common/stars/StarsReview";
import BaseModal from "@/components/common/modals/BaseModal";
import TextField from "@/components/common/inputs/TextField";
import useSubmitReview from "@/hooks/useSubmitReview";
import useUpdateReview from "@/hooks/useUpdateReview";
import styles from "./ReviewModal.module.scss";
import { ReviewReferenceType, ReviewPopulated } from "@/types/review";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  referenceType: ReviewReferenceType;
  onSuccess?: () => void;
  review?: ReviewPopulated; // If provided, we're in edit mode
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  reference,
  referenceType,
  onSuccess,
  review,
}) => {
  const { t } = useTranslation("reviews");
  const isEditMode = !!review;
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const { submitReview, isLoading: isSubmitting } = useSubmitReview();
  const { updateReview, isLoading: isUpdating } = useUpdateReview();
  const isLoading = isSubmitting || isUpdating;

  useEffect(() => {
    if (isOpen && review) {
      setRating(review.rating);
      setComment(review.comment || "");
    } else if (!isOpen) {
      setRating(0);
      setComment("");
    }
  }, [isOpen, review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      return;
    }

    try {
      if (isEditMode && review) {
        await updateReview(review._id, {
          rating,
          comment: comment.trim() || undefined,
        });
      } else {
        await submitReview({
          rating,
          comment: comment.trim() || undefined,
          reference,
          referenceType,
        });
      }
      onSuccess?.();
      onClose();
    } catch {
      // Error is handled in the hook
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t("reviewModal.editTitle") : t("reviewModal.writeTitle")}
      primaryButtonLabel={isEditMode ? t("common:actions.save") : t("reviewModal.publish")}
      secondaryButtonLabel={t("common:actions.cancel")}
      onPrimaryAction={handleSubmit}
      isPrimaryDisabled={rating === 0}
      isSubmitLoading={isLoading}
      primaryButtonType="submit"
    >
      <div className={styles.starsSection}>
        <label className={styles.label}>{t("reviewModal.ratingLabel")}</label>
        <StarsReview rating={rating} onRatingChange={setRating} size="large" />
      </div>
      <div className={styles.commentSection}>
        <TextField
          name="comment"
          label={t("reviewModal.commentLabel")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("reviewModal.commentPlaceholder")}
          multiline
          fullWidth
          rows={5}
          maxLength={1000}
          showCharCount
          className={styles.commentField}
        />
      </div>
    </BaseModal>
  );
};

export default ReviewModal;
