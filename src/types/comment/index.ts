import { BaseEntity } from "../common";
import { User, UserPopulated } from "../user";

export type CommentReferenceType = "Review" | "Image" | "Comment";

export interface Comment extends BaseEntity {
  _id: string;
  author: string | User;
  content: string;
  reference: string;
  referenceType: CommentReferenceType;
}

export interface CommentPopulated extends Omit<Comment, "author"> {
  author: UserPopulated;
}
