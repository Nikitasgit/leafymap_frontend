import { BaseEntity, LocationWithLabel } from "../common";
import { Place } from "../place";
import { SubCategory } from "../categories";

export type UserType = "creator" | "organizer" | "guest";

export interface CreatorProfile {
  categories: SubCategory[];
  place?: Place;
  name: string;
}

export interface User extends BaseEntity {
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  userType: UserType;
  phone?: string;
  website?: string;
  image?: string;
  description?: string;
  location?: LocationWithLabel;
  deleted?: boolean;
  followers?: string[];
  interests?: string[];
  places?: Place[];
  _id: string;
}

export interface Creator extends User {
  creatorProfile: CreatorProfile;
}

export interface Organizer extends User {
  places?: Place[];
}
