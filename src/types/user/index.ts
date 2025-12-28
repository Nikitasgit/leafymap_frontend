import { BaseEntity, LocationWithLabel } from "../common";
import { Image } from "../image";
import { Place, PlacePopulated } from "../place";
import { UserCategory } from "../categories";

export type UserType = "creator" | "organizer" | "guest";

export interface User extends BaseEntity {
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  userType: UserType;
  phone: string;
  website: string;
  image?: string | Image;
  description: string;
  location?: LocationWithLabel;
  deleted?: boolean;
  rating: number;
  followers?: string[];
  interests?: string[];
  places?: Place[];
  _id: string;
  creatorName: string;
  userCategories: string[] | UserCategory[];
}

export interface UserPopulated extends User {
  places?: PlacePopulated[];
  image?: Image;
  userCategories: UserCategory[];
}

export interface Organizer extends User {
  places?: Place[];
}
