// Public API of the comments feature — import from "@/features/comments".
// Prefer deep imports for types from other features to avoid barrel cycles:
// `@/features/comments/types`.

// Types
export type {
  CommentReferenceType,
  Comment,
  CommentPopulated,
} from "./types";

// API
export {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "./api/commentsApi";
export type {
  FetchCommentsParams,
  CreateCommentData,
  UpdateCommentData,
} from "./api/commentsApi";

// Hooks
export { useComments } from "./hooks/useComments";
export type { UseCommentsParams } from "./hooks/useComments";
export { default as useSubmitComment } from "./hooks/useSubmitComment";
export { default as useUpdateComment } from "./hooks/useUpdateComment";
export { default as useDeleteComment } from "./hooks/useDeleteComment";

// Components
export { default as CommentInput } from "./components/commentInput";
