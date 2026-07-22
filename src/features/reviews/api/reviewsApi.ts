import { request } from "@/shared/api/client";
import type { ReviewPopulated, ReviewReferenceType } from "../types";

export type FetchReviewsParams = {
  reference?: string;
  referenceType?: ReviewReferenceType;
  author?: string;
};

export type CreateReviewData = {
  rating: number;
  comment?: string;
  reference: string;
  referenceType: ReviewReferenceType;
};

export type UpdateReviewData = {
  rating?: number;
  comment?: string;
};

export const fetchReviews = async (
  params: FetchReviewsParams = {},
): Promise<ReviewPopulated[]> => {
  const searchParams = new URLSearchParams();
  if (params.reference) searchParams.append("reference", params.reference);
  if (params.referenceType)
    searchParams.append("referenceType", params.referenceType);
  if (params.author) searchParams.append("author", params.author);

  const query = searchParams.toString();
  const data = await request<{ reviews?: ReviewPopulated[] }>({
    method: "GET",
    url: `/api/reviews${query ? `?${query}` : ""}`,
  });
  return data?.reviews || [];
};

export const fetchMyReviews = async (): Promise<ReviewPopulated[]> => {
  const data = await request<{ reviews?: ReviewPopulated[] }>({
    method: "GET",
    url: `/api/reviews/my-reviews`,
  });
  return Array.isArray(data?.reviews) ? data.reviews : [];
};

export const fetchReceivedReviews = async (): Promise<ReviewPopulated[]> => {
  const data = await request<{ reviews?: ReviewPopulated[] }>({
    method: "GET",
    url: `/api/reviews/received`,
  });
  return Array.isArray(data?.reviews) ? data.reviews : [];
};

export const createReview = async (data: CreateReviewData): Promise<void> => {
  await request<void>({ method: "POST", url: `/api/reviews`, data });
};

export const updateReview = async (
  reviewId: string,
  data: UpdateReviewData,
): Promise<void> => {
  await request<void>({
    method: "PUT",
    url: `/api/reviews/${reviewId}`,
    data,
  });
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await request<void>({ method: "DELETE", url: `/api/reviews/${reviewId}` });
};
