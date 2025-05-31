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
  image?: string;
  description?: string;
  location?: Location;
  deleted?: boolean;
  followers?: string[];
  interests?: string[];
}
interface Creator extends User {
  creatorProfile: CreatorProfile;
}

interface Organizer extends User {
  places?: Place[];
}

export type { User, Creator, Organizer };
