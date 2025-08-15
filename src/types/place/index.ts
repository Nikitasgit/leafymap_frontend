import { BaseEntity, ContactInfo, Location } from "../common";
import { PlaceCategory, SubCategory } from "../categories";
import { Creator, User } from "../user";
import { DefaultSchedule } from "./schedule";
import { PlaceType } from "./placeCaterories";

export interface Place extends BaseEntity, ContactInfo {
  name: string;
  description?: string;
  userId: string | User;
  location: Location;
  placeCategory: PlaceCategory;
  categories: string[];
  defaultSchedule: DefaultSchedule;
  collaborators: {
    user: Creator;
    status: "pending" | "accepted" | "refused";
  }[];
  isCreatorPlace?: boolean;
  image?: string;
  active: boolean;
  rating: number;
  placeType: PlaceType[];
  creatorCategories?: SubCategory[];
}
