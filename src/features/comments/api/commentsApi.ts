import { request } from "@/shared/api/client";
import type { CommentPopulated, CommentReferenceType } from "../types";

export type FetchCommentsParams = {
  reference?: string;
  referenceType?: CommentReferenceType;
  author?: string;
};

export type CreateCommentData = {
  content: string;
  reference: string;
  referenceType: CommentReferenceType;
};

export type UpdateCommentData = {
  content: string;
};

export const fetchComments = async (
  params: FetchCommentsParams = {},
): Promise<CommentPopulated[]> => {
  const searchParams = new URLSearchParams();
  if (params.reference) searchParams.append("reference", params.reference);
  if (params.referenceType)
    searchParams.append("referenceType", params.referenceType);
  if (params.author) searchParams.append("author", params.author);

  const query = searchParams.toString();
  const data = await request<{ comments?: CommentPopulated[] }>({
    method: "GET",
    url: `/api/comments${query ? `?${query}` : ""}`,
  });
  return data?.comments || [];
};

export const createComment = async (data: CreateCommentData): Promise<void> => {
  await request<void>({ method: "POST", url: `/api/comments`, data });
};

export const updateComment = async (
  commentId: string,
  data: UpdateCommentData,
): Promise<void> => {
  await request<void>({
    method: "PUT",
    url: `/api/comments/${commentId}`,
    data,
  });
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await request<void>({
    method: "DELETE",
    url: `/api/comments/${commentId}`,
  });
};
