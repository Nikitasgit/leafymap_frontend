import { BaseEntity, LocationWithLabel } from "../common";
import { Image } from "../image";
import { Place } from "../place";
import { SubCategory } from "../categories";

export type UserType = "creator" | "organizer" | "guest";

export interface User extends BaseEntity {
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  userType: UserType;
  phone: string;
  website: string;
  image: string | Image;
  description: string;
  location?: LocationWithLabel;
  deleted?: boolean;
  followers?: string[];
  interests?: string[];
  places?: Place[];
  _id: string;
  creatorName: string;
  creatorCategories: SubCategory[];
}

export interface Organizer extends User {
  places?: Place[];
}
