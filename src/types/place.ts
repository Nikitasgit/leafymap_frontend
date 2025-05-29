import { PlaceCategory } from "./categories";

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

interface Place {
  _id: string;
  title: string;
  description?: string;
  userId: string;
  location: Location;
  placeCategory: PlaceCategory;
  categories: string[];
  defaultSchedule?: DefaultSchedule;
  collaborators?: string[];
  createdCollaborators?: string[];
  isCreatorPlace?: boolean;
  placeImg?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { Place };
