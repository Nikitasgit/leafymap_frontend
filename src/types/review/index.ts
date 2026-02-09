import { BaseEntity } from "../common";
import { User, UserPopulated } from "../user";

export type ReviewReferenceType = "Place" | "Event";

/** Référence Place peuplée (pour affichage dans "Avis rédigés") */
export interface ReviewReferencePlacePopulated {
  _id: string;
  location?: { label?: string };
  user?: {
    username?: string;
    image?: { urls?: { thumbnail?: string; original?: string } };
  };
}

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

/** Avis avec référence peuplée (ex: lieu avec location et user.username) */
export interface ReviewWithReferencePopulated extends Omit<ReviewPopulated, "reference"> {
  reference: string | ReviewReferencePlacePopulated;
}
