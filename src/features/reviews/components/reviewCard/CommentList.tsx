import React from "react";
import type { CommentPopulated } from "@/features/comments/types";
import type { UserPopulated } from "@/features/users/types";
import CommentItem from "./CommentItem";
import styles from "./ReviewCard.module.scss";

export type CommentListProps = {
  comments: CommentPopulated[];
  currentUser: UserPopulated;
  reviewId: string;
  editingCommentId: string | null;
  isDeleting: boolean;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onEditSuccess: () => void;
  onEditCancel: () => void;
};

const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUser,
  reviewId,
  editingCommentId,
  isDeleting,
  onEdit,
  onDelete,
  onEditSuccess,
  onEditCancel,
}) => {
  if (comments.length === 0) return null;

  return (
    <div className={styles.commentsList}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          reviewId={reviewId}
          isEditing={editingCommentId === comment.id}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
          onEditSuccess={onEditSuccess}
          onEditCancel={onEditCancel}
        />
      ))}
    </div>
  );
};

export default CommentList;
