import { BaseEntity, LocationWithLabel } from "@/shared/types/common";
import { Image } from "@/shared/types/image";
import type { Place, PlacePopulated } from "@/features/places/types/place";
import { UserCategory } from "@/shared/types/categories";

export type UserType = "creator" | "guest";
export type UserRole = "user" | "admin";

export interface UserPreferences {
  emailNotifications?: boolean;
}

export interface User extends BaseEntity {
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  userType: UserType;
  role?: UserRole;
  phone: string;
  website: string;
  image?: string | Image;
  googlePictureUrl?: string;
  description: string;
  location?: LocationWithLabel;
  deleted?: boolean;
  followers?: number;
  interests?: string[];
  place?: Place;
  id: string;
  userCategory?: string | UserCategory;
  acceptedCGU?: boolean;
  bannedAt?: string;
  banReason?: string;
  banDuration?: number;
  banExpiresAt?: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPopulated extends User {
  place?: PlacePopulated;
  image?: Image;
  userCategory?: UserCategory;
}
