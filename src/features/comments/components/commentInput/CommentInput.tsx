import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/buttons/button";
import TextField from "@/shared/ui/inputs/textField";
import useSubmitComment from "../../hooks/useSubmitComment";
import useUpdateComment from "../../hooks/useUpdateComment";
import type { CommentReferenceType, CommentPopulated } from "../../types";
import styles from "./CommentInput.module.scss";

interface CommentInputProps {
  reference: string;
  referenceType: CommentReferenceType;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  comment?: CommentPopulated;
}

const CommentInput: React.FC<CommentInputProps> = ({
  reference,
  referenceType,
  onSuccess,
  onCancel,
  placeholder,
  comment,
}) => {
  const { t } = useTranslation("reviews");
  const isEditMode = !!comment;
  const [content, setContent] = useState(comment?.content || "");
  const [prevCommentId, setPrevCommentId] = useState(comment?.id);
  const resolvedPlaceholder =
    placeholder ?? t("commentInput.defaultPlaceholder");
  const { submitComment, isLoading: isSubmitting } = useSubmitComment();
  const { updateComment, isLoading: isUpdating } = useUpdateComment();
  const isLoading = isSubmitting || isUpdating;

  if (comment?.id !== prevCommentId) {
    setPrevCommentId(comment?.id);
    setContent(comment?.content || "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      if (isEditMode && comment) {
        await updateComment(comment.id, {
          content: content.trim(),
        });
      } else {
        await submitComment({
          content: content.trim(),
          reference,
          referenceType,
        });
        setContent("");
      }
      onSuccess?.();
    } catch {
      // Error is handled in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentInput}>
      <TextField
        name="comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={resolvedPlaceholder}
        multiline
        fullWidth
        rows={3}
        maxLength={1000}
        disabled={isLoading}
        className={styles.commentField}
      />
      <div className={styles.actions}>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("common:actions.cancel")}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="small"
          disabled={isLoading || !content.trim()}
        >
          {isLoading
            ? isEditMode
              ? t("commentInput.updating")
              : t("commentInput.publishing")
            : isEditMode
              ? t("common:actions.save")
              : t("commentInput.publish")}
        </Button>
      </div>
    </form>
  );
};

export default CommentInput;
