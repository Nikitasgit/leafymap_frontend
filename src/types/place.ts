import { CreatedCollaborator } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { PlaceCategory } from "./categories";
import { User } from "./user";

interface Location {
  type: "Point";
  coordinates: [number, number];
  label: string;
  id?: string;
}

interface ScheduleTimeRange {
  from: string;
  to: string;
}

interface DaySchedule {
  isClosed: boolean;
  timeRanges: ScheduleTimeRange[];
}

type DefaultSchedule = {
  [day: string]: DaySchedule;
};

type CreatedCollaboratorDB = {
  name: string;
  category: string;
  categoryId: string;
  _id?: string;
};

interface Place {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  location: Location;
  placeCategory: PlaceCategory;
  categories: string[];
  defaultSchedule?: DefaultSchedule;
  collaborators?: {
    user: User;
    status: "pending" | "accepted" | "refused";
  }[];
  createdCollaborators?: CreatedCollaboratorDB[];
  isCreatorPlace?: boolean;
  image?: string;
  phone?: string;
  email?: string;
  website?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { Place };
