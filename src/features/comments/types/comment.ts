import type { BaseEntity } from "@/shared/types/common";
import type { User, UserPopulated } from "@/features/users/types";

export type CommentReferenceType = "Review" | "Image" | "Comment";

export interface Comment extends BaseEntity {
  id: string;
  author: string | User;
  content: string;
  reference: string;
  referenceType: CommentReferenceType;
}

export interface CommentPopulated extends Omit<Comment, "author"> {
  author: UserPopulated;
}
