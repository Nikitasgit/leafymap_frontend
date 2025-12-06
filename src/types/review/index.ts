import { BaseEntity } from "../common";
import { User, UserPopulated } from "../user";

export type ReviewReferenceType = "Place" | "Event" | "User";

export interface Review extends BaseEntity {
  _id: string;
  author: string | User;
  rating: number;
  comment?: string;
  reference: string;
  referenceType: ReviewReferenceType;
  certified: boolean;
}

export interface ReviewPopulated extends Omit<Review, "author"> {
  author: UserPopulated;
}
