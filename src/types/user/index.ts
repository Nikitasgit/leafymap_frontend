import { BaseEntity, LocationWithLabel } from "../common";
import { Image } from "../image";
import { Place, PlacePopulated } from "../place";
import { UserCategory } from "../categories";

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
  _id: string;
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
