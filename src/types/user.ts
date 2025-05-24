import { SubCategory } from "./categories";
import { Place } from "./place";
interface Address {
  number?: string;
  street: string;
  code: string;
  extra?: string;
}

interface CreatorProfile {
  categories: SubCategory[];
  creatorPlace?: Place;
  creatorName: string;
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
  address?: Address;
  deleted?: boolean;
  followers?: string[];
  creatorProfile?: CreatorProfile;
  interests?: string[];
}

export type { User };
