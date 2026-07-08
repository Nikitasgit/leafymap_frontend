import React, { useState } from "react";
import Image from "next/image";
import { Reply } from "lucide-react";
import StarsDisplay from "@/components/common/stars/StarsDisplay";
import {
  ReviewPopulated,
  ReviewWithReferencePopulated,
} from "@/types/review";
import { UserPopulated } from "@/types/user";
import { useComments } from "@/hooks/useComments";
import CommentInput from "../CommentInput";
import ReviewModal from "../ReviewModal";
import useDeleteReview from "@/hooks/useDeleteReview";
import useDeleteComment from "@/hooks/useDeleteComment";
import ActionButtons from "@/components/common/actions/ActionButtons";
import styles from "./ReviewCard.module.scss";
import DisplayPublishingDate from "@/components/common/date/DisplayPublishingDate";

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
  const { deleteReview, isLoading: isDeletingReview } = useDeleteReview();
  const { deleteComment, isLoading: isDeletingComment } = useDeleteComment();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const { comments, refetch: refetchComments } = useComments({
    reference: review._id,
    referenceType: "Review",
  });

  const author = typeof review.author === "object" ? review.author : null;
  const isAuthor = user && author && user._id === author._id;

  // Check if the current user has already replied to this review
  const userComment = comments.find((comment) => {
    const commentAuthor =
      typeof comment.author === "object" ? comment.author : null;
    return user && commentAuthor && user._id === commentAuthor._id;
  });
  const hasUserReplied = !!userComment;

  const getDisplayName = (user: typeof author): string => {
    if (!user) return "Utilisateur";

    if (user.username) {
      return user.username;
    }

    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }

    return user.username || "Utilisateur";
  };

  const handleReplySuccess = () => {
    setShowReplyInput(false);
    setEditingCommentId(null);
    refetchComments();
  };

  const handleEditComment = (commentId: string) => {
    setEditingCommentId(commentId);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      refetchComments();
    } catch {
      // Error is handled in the hook
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      await deleteReview(review._id);
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
          {author?.image ? (
            <Image
              src={author?.image.urls?.thumbnail}
              alt={author?.username || "Utilisateur"}
              width={40}
              height={40}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {author?.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>{getDisplayName(author)}</span>
            {review.createdAt && (
              <DisplayPublishingDate
                date={
                  typeof review.createdAt === "string"
                    ? review.createdAt
                    : review.createdAt
                }
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
                  onClick: handleEdit,
                  ariaLabel: "Modifier mon avis",
                },
                {
                  type: "delete",
                  onClick: handleDelete,
                  disabled: isDeletingReview,
                  ariaLabel: "Supprimer mon avis",
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
            aria-label="Répondre à cet avis"
          >
            <Reply size={16} />
            <span>Répondre</span>
          </button>

          {showReplyInput && (
            <CommentInput
              reference={review._id}
              referenceType="Review"
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyInput(false)}
            />
          )}
        </div>
      )}

      {comments.length > 0 && (
        <div className={styles.commentsList}>
          {comments.map((comment) => {
            const commentAuthor =
              typeof comment.author === "object" ? comment.author : null;
            const commentAuthorImage =
              commentAuthor?.image && typeof commentAuthor.image === "object"
                ? commentAuthor.image.urls?.thumbnail ||
                  commentAuthor.image.urls?.original
                : null;
            const isCommentAuthor =
              user && commentAuthor && user._id === commentAuthor._id;
            const isEditing = editingCommentId === comment._id;

            return (
              <div key={comment._id} className={styles.commentItem}>
                {!isEditing ? (
                  <>
                    {commentAuthorImage ? (
                      <Image
                        src={commentAuthorImage}
                        alt={commentAuthor?.username || "Utilisateur"}
                        width={32}
                        height={32}
                        className={styles.commentAvatar}
                      />
                    ) : (
                      <div className={styles.commentAvatarPlaceholder}>
                        {commentAuthor?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div className={styles.commentContent}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthorName}>
                          {getDisplayName(commentAuthor)}
                        </span>
                        {comment.createdAt && (
                          <DisplayPublishingDate
                            date={
                              typeof comment.createdAt === "string"
                                ? comment.createdAt
                                : comment.createdAt
                            }
                            className={styles.commentDate}
                          />
                        )}
                        {isCommentAuthor && (
                          <ActionButtons
                            actions={[
                              {
                                type: "edit",
                                onClick: () => handleEditComment(comment._id),
                                ariaLabel: "Modifier mon commentaire",
                              },
                              {
                                type: "delete",
                                onClick: () => handleDeleteComment(comment._id),
                                disabled: isDeletingComment,
                                ariaLabel: "Supprimer mon commentaire",
                              },
                            ]}
                            iconSize={14}
                            className={styles.commentActions}
                          />
                        )}
                      </div>
                      <p className={styles.commentText}>{comment.content}</p>
                    </div>
                  </>
                ) : (
                  <CommentInput
                    reference={review._id}
                    referenceType="Review"
                    comment={comment}
                    onSuccess={handleReplySuccess}
                    onCancel={() => setEditingCommentId(null)}
                    placeholder="Modifiez votre commentaire..."
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {isEditModalOpen && (
        <ReviewModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          reference={
            typeof review.reference === "object" && review.reference && "_id" in review.reference
              ? review.reference._id
              : (review.reference as string)
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
