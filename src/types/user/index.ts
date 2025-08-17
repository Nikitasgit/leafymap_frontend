import { BaseEntity, LocationWithLabel } from "../common";
import { Place } from "../place";

export type UserType = "creator" | "organizer" | "guest";

export interface User extends BaseEntity {
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  userType: UserType;
  phone: string;
  website: string;
  image: string;
  description: string;
  location?: LocationWithLabel;
  deleted?: boolean;
  followers?: string[];
  interests?: string[];
  places?: Place[];
  _id: string;
}

export interface Creator extends User {
  creatorName: string;
  categories: string[];
}

export interface Organizer extends User {
  places?: Place[];
}
