import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Reply } from "lucide-react";
import StarsDisplay from "../starsDisplay";
import type {
  ReviewPopulated,
  ReviewWithReferencePopulated,
} from "../../types";
import type { UserPopulated } from "@/features/users/types";
import { useComments } from "@/features/comments/hooks/useComments";
import CommentInput from "@/features/comments/components/commentInput";
import useDeleteComment from "@/features/comments/hooks/useDeleteComment";
import ReviewModal from "../reviewModal";
import useDeleteReview from "../../hooks/useDeleteReview";
import ActionButtons from "@/shared/ui/actions/actionButtons";
import DisplayPublishingDate from "@/shared/ui/date/displayPublishingDate";
import Avatar from "@/shared/ui/avatar";
import { getDisplayName } from "@/shared/utils/userDisplay";
import {
  resolveRefId,
  resolveRefObject,
} from "@/shared/api/normalizers/resolveRef";
import CommentList from "./CommentList";
import styles from "./ReviewCard.module.scss";

interface ReviewCardProps {
  review: ReviewPopulated | ReviewWithReferencePopulated;
  user: UserPopulated;
  onReply?: (reviewId: string) => void;
  onReviewUpdated?: () => void;
  onReviewDeleted?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  user,
  onReply,
  onReviewUpdated,
  onReviewDeleted,
}) => {
  const { t } = useTranslation("reviews");
  const { deleteReview, isLoading: isDeletingReview } = useDeleteReview();
  const { deleteComment, isLoading: isDeletingComment } = useDeleteComment();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const { comments, refetch: refetchComments } = useComments({
    reference: review.id,
    referenceType: "Review",
  });

  const author = resolveRefObject(review.author);
  const isAuthor = Boolean(user && author && user.id === author.id);
  const defaultUser = t("reviewCard.defaultUser");

  const userComment = comments.find((comment) => {
    const commentAuthor = resolveRefObject(comment.author);
    return user && commentAuthor && user.id === commentAuthor.id;
  });
  const hasUserReplied = Boolean(userComment);

  const handleReplySuccess = () => {
    setShowReplyInput(false);
    setEditingCommentId(null);
    refetchComments();
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      refetchComments();
    } catch {
      // Error is handled in the hook
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("reviewCard.deleteConfirm"))) {
      return;
    }

    try {
      await deleteReview(review.id);
      onReviewDeleted?.();
    } catch {
      // Error is handled in the hook
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    onReviewUpdated?.();
  };

  return (
    <article className={styles.reviewCard}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <Avatar user={author} size={40} className={styles.avatar} />
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>
              {getDisplayName(author, defaultUser)}
            </span>
            {review.createdAt && (
              <DisplayPublishingDate
                date={review.createdAt}
                className={styles.reviewDate}
              />
            )}
          </div>
        </div>
        <div className={styles.ratingSection}>
          <StarsDisplay rating={review.rating} size="small" />
          {isAuthor && (
            <ActionButtons
              actions={[
                {
                  type: "edit",
                  onClick: () => setIsEditModalOpen(true),
                  ariaLabel: t("reviewCard.editReviewAria"),
                },
                {
                  type: "delete",
                  onClick: handleDelete,
                  disabled: isDeletingReview,
                  ariaLabel: t("reviewCard.deleteReviewAria"),
                },
              ]}
              iconSize={16}
              className={styles.actions}
            />
          )}
        </div>
      </div>

      {review.comment && (
        <div className={styles.comment}>
          <p>{review.comment}</p>
        </div>
      )}

      {onReply && !hasUserReplied && (
        <div className={styles.replySection}>
          <button
            className={styles.replyButton}
            onClick={() => setShowReplyInput(!showReplyInput)}
            aria-label={t("reviewCard.replyAria")}
          >
            <Reply size={16} />
            <span>{t("reviewCard.reply")}</span>
          </button>

          {showReplyInput && (
            <CommentInput
              reference={review.id}
              referenceType="Review"
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyInput(false)}
            />
          )}
        </div>
      )}

      <CommentList
        comments={comments}
        currentUser={user}
        reviewId={review.id}
        editingCommentId={editingCommentId}
        isDeleting={isDeletingComment}
        onEdit={setEditingCommentId}
        onDelete={handleDeleteComment}
        onEditSuccess={handleReplySuccess}
        onEditCancel={() => setEditingCommentId(null)}
      />

      {isEditModalOpen && (
        <ReviewModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          reference={
            resolveRefId(
              review.reference as string | { id: string } | null | undefined,
            ) ?? ""
          }
          referenceType={review.referenceType}
          review={review as ReviewPopulated}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </article>
  );
};

export default ReviewCard;
