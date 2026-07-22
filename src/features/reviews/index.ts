// Public API of the reviews feature — import from "@/features/reviews".
// Prefer deep imports for types from other features to avoid barrel cycles:
// `@/features/reviews/types`.

// Types
export type {
  ReviewReferenceType,
  ReviewReferencePlacePopulated,
  Review,
  ReviewPopulated,
  ReviewWithReferencePopulated,
} from "./types";

// API
export {
  fetchReviews,
  fetchMyReviews,
  fetchReceivedReviews,
  createReview,
  updateReview,
  deleteReview,
} from "./api/reviewsApi";
export type {
  FetchReviewsParams,
  CreateReviewData,
  UpdateReviewData,
} from "./api/reviewsApi";

// Hooks
export { useReviews } from "./hooks/useReviews";
export type { UseReviewsParams } from "./hooks/useReviews";
export { useReviewsWritten } from "./hooks/useReviewsWritten";
export { useReviewsReceived } from "./hooks/useReviewsReceived";
export { default as useSubmitReview } from "./hooks/useSubmitReview";
export { default as useUpdateReview } from "./hooks/useUpdateReview";
export { default as useDeleteReview } from "./hooks/useDeleteReview";

// Components
export { default as ReviewsTab } from "./components/reviewsTab";
export { default as ReviewCard } from "./components/reviewCard";
export { default as ReviewModal } from "./components/reviewModal";
export { default as ReviewsWrittenTab } from "./components/reviewsWrittenTab";
export { default as ReviewsReceivedTab } from "./components/reviewsReceivedTab";
export { default as StarsDisplay } from "./components/starsDisplay";
export { default as StarsReview } from "./components/starsReview";
