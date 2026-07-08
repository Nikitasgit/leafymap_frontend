import React, { useState, useEffect } from "react";
import Button from "@/components/common/buttons/Button";
import TextField from "@/components/common/inputs/TextField";
import useSubmitComment from "@/hooks/useSubmitComment";
import useUpdateComment from "@/hooks/useUpdateComment";
import { CommentReferenceType, CommentPopulated } from "@/types/comment";
import styles from "./CommentInput.module.scss";

interface CommentInputProps {
  reference: string;
  referenceType: CommentReferenceType;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  comment?: CommentPopulated; // If provided, we're in edit mode
}

const CommentInput: React.FC<CommentInputProps> = ({
  reference,
  referenceType,
  onSuccess,
  onCancel,
  placeholder = "Écrivez votre réponse...",
  comment,
}) => {
  const isEditMode = !!comment;
  const [content, setContent] = useState(comment?.content || "");
  const { submitComment, isLoading: isSubmitting } = useSubmitComment();
  const { updateComment, isLoading: isUpdating } = useUpdateComment();
  const isLoading = isSubmitting || isUpdating;

  useEffect(() => {
    if (comment) {
      setContent(comment.content);
    } else {
      setContent("");
    }
  }, [comment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      if (isEditMode && comment) {
        await updateComment(comment._id, {
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
        placeholder={placeholder}
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
            Annuler
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
              ? "Modification..."
              : "Publication..."
            : isEditMode
            ? "Enregistrer"
            : "Publier"}
        </Button>
      </div>
    </form>
  );
};

export default CommentInput;
