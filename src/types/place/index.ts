import { BaseEntity, ContactInfo, Location } from "../common";
import { PlaceCategory, UserCategory } from "../categories";
import { User, UserPopulated } from "../user";
import { Image } from "../image";
import { DefaultSchedule } from "./schedule";
import { PlaceType } from "./placeCaterories";

export interface Place extends BaseEntity, ContactInfo {
  name: string;
  description: string;
  user: string | User;
  location: Location | null;
  placeCategory: string | (PlaceCategory & { _id: string });
  categories: string[];
  defaultSchedule: DefaultSchedule;
  isCreatorPlace?: boolean;
  image?: string | Image;
  active: boolean;
  rating: number;
  placeType: PlaceType[];
  userCategories?: UserCategory[];
  followers: string[];
}

export interface PlacePopulated extends Place {
  image: Image;
  user: UserPopulated;
  placeCategory: PlaceCategory;
}
