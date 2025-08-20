import { BaseEntity, ContactInfo, Location } from "../common";
import { PlaceCategory, SubCategory } from "../categories";
import { User } from "../user";
import { DefaultSchedule } from "./schedule";
import { PlaceType } from "./placeCaterories";

export interface Place extends BaseEntity, ContactInfo {
  name: string;
  description: string;
  userId: string | User;
  location: Location | null;
  placeCategory: string | (PlaceCategory & { _id: string });
  categories: string[];
  defaultSchedule: DefaultSchedule;
  isCreatorPlace?: boolean;
  image?: string;
  active: boolean;
  rating: number;
  placeType: PlaceType[];
  creatorCategories?: SubCategory[];
}
