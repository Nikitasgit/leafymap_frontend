import type { BaseEntity } from "@/shared/types/common";
import type { User, UserPopulated } from "@/features/users/types";

export type ReviewReferenceType = "Place" | "Event";

/** Référence Place peuplée (pour affichage dans "Avis rédigés") */
export interface ReviewReferencePlacePopulated {
  id: string;
  location?: { label?: string };
  user?: {
    username?: string;
    image?: { urls?: { thumbnail?: string; original?: string } };
  };
}

export interface Review extends BaseEntity {
  id: string;
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
export interface ReviewWithReferencePopulated
  extends Omit<ReviewPopulated, "reference"> {
  reference: string | ReviewReferencePlacePopulated;
}
