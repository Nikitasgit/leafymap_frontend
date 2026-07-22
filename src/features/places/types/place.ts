import { BaseEntity, ContactInfo, Location } from "@/shared/types/common";
import { PlaceCategory, UserCategory } from "@/shared/types/categories";
import type { User, UserPopulated } from "@/features/users/types";
import { Image } from "@/shared/types/image";
import { DefaultSchedule } from "./schedule";

export interface Place extends BaseEntity, ContactInfo {
  name: string;
  description: string;
  user: string | User;
  location: Location | null;
  placeCategory: string | (PlaceCategory & { id: string });
  categories: string[];
  defaultSchedule: DefaultSchedule;
  isCreatorPlace?: boolean;
  image?: string | Image;
  active: boolean;
  rating: number;
  userCategory?: UserCategory;
  followers: string[];
}

export interface PlacePopulated extends Place {
  image: Image;
  user: UserPopulated;
  placeCategory: PlaceCategory;
}
