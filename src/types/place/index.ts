import { BaseEntity, ContactInfo, Location } from "../common";
import { PlaceCategory } from "../categories";
import { User } from "../user";
import { DefaultSchedule } from "./schedule";
import { CreatedCollaborator } from "./collaborators";
import { PlaceType } from "./placeCaterories";

export interface Place extends BaseEntity, ContactInfo {
  name: string;
  description?: string;
  userId: string;
  location: Location;
  placeCategory: PlaceCategory;
  categories: string[];
  defaultSchedule: DefaultSchedule;
  collaborators?: {
    user: User;
    status: "pending" | "accepted" | "refused";
  }[];
  createdCollaborators?: CreatedCollaborator[];
  isCreatorPlace?: boolean;
  image?: string;
  active: boolean;
  rating: number;
  placeType: PlaceType[];
  creatorCategories?: SubCategory[];
}
