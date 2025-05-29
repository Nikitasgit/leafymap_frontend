import { SubCategory } from "./categories";
import { Place } from "./place";
import { Location } from "./map";

interface CreatorProfile {
  categories: SubCategory[];
  place?: Place;
  name: string;
}

type UserType = "creator" | "organizer" | "guest";

interface User {
  _id: string;
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  userType: UserType;
  createdAt?: Date;
  phone?: string;
  website?: string;
  updatedAt?: Date;
  userImg?: string;
  description?: string;
  location?: Location;
  deleted?: boolean;
  followers?: string[];
  places?: Place[];
  interests?: string[];
}
interface Creator extends Omit<User, "places"> {
  creatorProfile: CreatorProfile;
}

export type { User, Creator };
