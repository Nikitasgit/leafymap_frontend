import React from "react";
import { useTranslation } from "react-i18next";
import type { CommentPopulated } from "@/features/comments/types";
import type { UserPopulated } from "@/features/users/types";
import CommentInput from "@/features/comments/components/commentInput";
import ActionButtons from "@/shared/ui/actions/actionButtons";
import DisplayPublishingDate from "@/shared/ui/date/displayPublishingDate";
import Avatar from "@/shared/ui/avatar";
import { getDisplayName } from "@/shared/utils/userDisplay";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";
import styles from "./ReviewCard.module.scss";

export type CommentItemProps = {
  comment: CommentPopulated;
  currentUser: UserPopulated;
  reviewId: string;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onEditSuccess: () => void;
  onEditCancel: () => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  reviewId,
  isEditing,
  isDeleting,
  onEdit,
  onDelete,
  onEditSuccess,
  onEditCancel,
}) => {
  const { t } = useTranslation("reviews");
  const commentAuthor = resolveRefObject(comment.author);
  const isCommentAuthor =
    Boolean(currentUser && commentAuthor && currentUser.id === commentAuthor.id);
  const defaultUser = t("reviewCard.defaultUser");

  if (isEditing) {
    return (
      <div className={styles.commentItem}>
        <CommentInput
          reference={reviewId}
          referenceType="Review"
          comment={comment}
          onSuccess={onEditSuccess}
          onCancel={onEditCancel}
          placeholder={t("reviewCard.editCommentPlaceholder")}
        />
      </div>
    );
  }

  return (
    <div className={styles.commentItem}>
      <Avatar user={commentAuthor} size={32} className={styles.commentAvatar} />
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span className={styles.commentAuthorName}>
            {getDisplayName(commentAuthor, defaultUser)}
          </span>
          {comment.createdAt && (
            <DisplayPublishingDate
              date={comment.createdAt}
              className={styles.commentDate}
            />
          )}
          {isCommentAuthor && (
            <ActionButtons
              actions={[
                {
                  type: "edit",
                  onClick: () => onEdit(comment.id),
                  ariaLabel: t("reviewCard.editCommentAria"),
                },
                {
                  type: "delete",
                  onClick: () => onDelete(comment.id),
                  disabled: isDeleting,
                  ariaLabel: t("reviewCard.deleteCommentAria"),
                },
              ]}
              iconSize={14}
              className={styles.commentActions}
            />
          )}
        </div>
        <p className={styles.commentText}>{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
