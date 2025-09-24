import { BaseEntity, ContactInfo, Location } from "../common";
import { PlaceCategory, SubCategory } from "../categories";
import { User } from "../user";
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
  creatorCategories?: SubCategory[];
  followers: string[];
}

export interface PlacePopulated extends Place {
  image: Image;
  user: User;
  placeCategory: PlaceCategory;
}
